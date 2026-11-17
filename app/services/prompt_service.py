import json
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
EPISODES_DIR = BASE_DIR / "episodes"
PROMPTS_FILE = DATA_DIR / "prompts.json"
EPISODES_FILE = DATA_DIR / "episodes.json"

def get_prompts(
    status_filter: Optional[str] = "all",
    type_filter: Optional[str] = "all",
    search: Optional[str] = ""
) -> List[Dict[str, Any]]:
    if not PROMPTS_FILE.exists():
        return []
    with open(PROMPTS_FILE, "r", encoding="utf-8") as f:
        prompts = json.load(f)
        
    query = (search or "").lower().strip()
    filtered = []
    for p in prompts:
        if status_filter and status_filter != "all" and p.get("status") != status_filter:
            continue
        if type_filter and type_filter != "all" and p.get("type") != type_filter:
            continue
        if query:
            searchable = f"{p.get('episode_title', '')} {p.get('prompt_text', '')} {p.get('model', '')} {p.get('scene', '')}".lower()
            if query not in searchable:
                continue
        filtered.append(p)
        
    return filtered

def fulfill_prompt_with_file(
    prompt_id: str,
    filename: str,
    file_bytes: bytes
) -> Optional[Dict[str, Any]]:
    if not PROMPTS_FILE.exists():
        return None
    with open(PROMPTS_FILE, "r", encoding="utf-8") as f:
        prompts = json.load(f)
        
    target_prompt = None
    for p in prompts:
        if p.get("id") == prompt_id:
            target_prompt = p
            break
            
    if not target_prompt:
        return None
        
    ep_id = target_prompt.get("episode_id", "common")
    
    # Locate destination media folder
    dest_dir = None
    for item in EPISODES_DIR.iterdir():
        if item.is_dir() and item.name.startswith(ep_id):
            dest_dir = item / "media"
            break
            
    if not dest_dir:
        dest_dir = BASE_DIR / "assets"
        
    dest_dir.mkdir(parents=True, exist_ok=True)
    saved_file = dest_dir / filename
    
    with open(saved_file, "wb") as f:
        f.write(file_bytes)
        
    rel_path = str(saved_file.relative_to(BASE_DIR)).replace("\\", "/")
    
    target_prompt["status"] = "fulfilled"
    target_prompt["status_label"] = "Fulfilled just now"
    target_prompt["bar_color"] = "bg-[#1FB6A6]"
    target_prompt["file_path"] = rel_path
    target_prompt["fulfilled_file"] = filename
    
    with open(PROMPTS_FILE, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2)
        
    # Also sync into episode prompts
    for item in EPISODES_DIR.iterdir():
        if item.is_dir() and item.name.startswith(ep_id):
            ep_prompts_file = item / "prompts.json"
            if ep_prompts_file.exists():
                with open(ep_prompts_file, "r", encoding="utf-8") as epf:
                    ep_prompts = json.load(epf)
                for ep_p in ep_prompts:
                    if ep_p.get("id") == prompt_id:
                        ep_p.update(target_prompt)
                with open(ep_prompts_file, "w", encoding="utf-8") as epf:
                    json.dump(ep_prompts, epf, indent=2)
                    
    # Sync episode progress
    if EPISODES_FILE.exists():
        with open(EPISODES_FILE, "r", encoding="utf-8") as ef:
            episodes = json.load(ef)
        for ep in episodes:
            if ep.get("id") == ep_id:
                ep_prompts = [p for p in prompts if p.get("episode_id") == ep_id]
                fulfilled = sum(1 for p in ep_prompts if p.get("status") == "fulfilled")
                ep["fulfilled_prompts"] = fulfilled
                ep["progress"] = int((fulfilled / ep.get("total_prompts", 1)) * 100)
        with open(EPISODES_FILE, "w", encoding="utf-8") as ef:
            json.dump(episodes, ef, indent=2)
            
    return target_prompt
