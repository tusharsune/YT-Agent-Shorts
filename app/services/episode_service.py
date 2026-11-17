import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
EPISODES_DIR = BASE_DIR / "episodes"
EPISODES_FILE = DATA_DIR / "episodes.json"
PROMPTS_FILE = DATA_DIR / "prompts.json"

def get_all_episodes(filter_stage: Optional[str] = None) -> List[Dict[str, Any]]:
    if not EPISODES_FILE.exists():
        return []
    with open(EPISODES_FILE, "r", encoding="utf-8") as f:
        episodes = json.load(f)
    
    if filter_stage and filter_stage != "all":
        if filter_stage == "media-pending":
            episodes = [e for e in episodes if e.get("status") == "media-pending"]
        elif filter_stage == "in-assembly":
            episodes = [e for e in episodes if e.get("status") == "in-assembly"]
        elif filter_stage == "ready":
            episodes = [e for e in episodes if e.get("status") in ("ready", "scheduled", "published")]

    return episodes

def get_episode_by_id(episode_id: str) -> Optional[Dict[str, Any]]:
    episodes = get_all_episodes()
    for ep in episodes:
        if ep.get("id") == episode_id:
            return ep
    return None

def create_episode(data: Dict[str, Any]) -> Dict[str, Any]:
    episodes = get_all_episodes()
    max_num = max([e.get("episode_number", 140) for e in episodes], default=140)
    new_num = max_num + 1
    
    title = data.get("title", f"Short Episode #{new_num}")
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')
    ep_id = f"ep_{new_num}"
    
    new_ep = {
        "id": ep_id,
        "episode_number": new_num,
        "title": title,
        "slug": slug,
        "topic": data.get("topic", title),
        "angle": data.get("angle", "Engaging hook with human-centric payoff"),
        "status": "media-pending",
        "stage": "Idea & Hook Scored",
        "progress": 0,
        "fulfilled_prompts": 0,
        "total_prompts": data.get("total_prompts", 4),
        "scheduled_date": data.get("scheduled_date", "Unscheduled"),
        "target_day": data.get("target_day", "TBD"),
        "score": data.get("score", 85),
        "target_duration": data.get("target_duration", "45s"),
        "script_status": "Draft Generated",
        "attention_required": False,
        "blocker_note": None,
        "youtube_url": None
    }
    
    episodes.append(new_ep)
    with open(EPISODES_FILE, "w", encoding="utf-8") as f:
        json.dump(episodes, f, indent=2)
        
    # Create episode directory structure
    folder_name = f"{ep_id}_{slug}"
    ep_path = EPISODES_DIR / folder_name
    (ep_path / "media").mkdir(parents=True, exist_ok=True)
    
    with open(ep_path / "meta.json", "w", encoding="utf-8") as f:
        json.dump(new_ep, f, indent=2)
        
    initial_script = f"""# {new_ep['title']} (Episode {new_num})
Topic: {new_ep['topic']}
Angle: {new_ep['angle']}
Target Duration: {new_ep['target_duration']}

## Hook
Have you ever seen something so deceptively simple hold a universe of complexity?

## Scene 1
Visual: Dynamic vertical zoom on the subject.
Voice: Let's break down what's actually happening here.
Delivery: [Calm, warm, melodic]

## Scene 2
Visual: Close-up mechanical precision demonstration.
Voice: Once you understand the rhythm, you can never unsee it.
Delivery: [0.5s pause before the turn]
"""
    with open(ep_path / "script.md", "w", encoding="utf-8") as f:
        f.write(initial_script)
        
    # Create initial prompts
    initial_prompts = [
        {
            "id": f"q_{ep_id}_s1_img",
            "episode_id": ep_id,
            "episode_title": title,
            "scene": "Scene 1",
            "scene_number": 1,
            "badge_label": "Image (Gemini)",
            "target_tool": "Gemini",
            "model": "Gemini AI Studio",
            "type": "image",
            "status": "pending",
            "bar_color": "bg-[#FFC53D]",
            "status_label": "Pending asset",
            "prompt_heading": "Visual still image prompt",
            "prompt_text": f"Cinematic 9:16 vertical shot, warm lighting, macro detail of {new_ep['topic']}, studio setup.",
            "specs": ["Aspect: 9:16", "Style: Cinematic Warm", "Resolution: 1080x1920"],
            "file_path": None
        },
        {
            "id": f"q_{ep_id}_s1_voice",
            "episode_id": ep_id,
            "episode_title": title,
            "scene": "Scene 1",
            "scene_number": 1,
            "badge_label": "Voice (Flow)",
            "target_tool": "Flow",
            "model": "Flow Voiceover",
            "type": "voice",
            "status": "pending",
            "bar_color": "bg-[#FFC53D]",
            "status_label": "Pending voice stem",
            "prompt_heading": "Voice line audio script",
            "prompt_text": "Have you ever seen something so deceptively simple hold a universe of complexity? [0.5s pause]",
            "specs": ["Voice: Warm Storyteller", "Est duration: 5.0s"],
            "file_path": None
        }
    ]
    with open(ep_path / "prompts.json", "w", encoding="utf-8") as f:
        json.dump(initial_prompts, f, indent=2)
        
    # Append to master prompts
    if PROMPTS_FILE.exists():
        with open(PROMPTS_FILE, "r", encoding="utf-8") as f:
            all_prompts = json.load(f)
        all_prompts.extend(initial_prompts)
        with open(PROMPTS_FILE, "w", encoding="utf-8") as f:
            json.dump(all_prompts, f, indent=2)
            
    return new_ep

def update_episode(episode_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    episodes = get_all_episodes()
    target = None
    for ep in episodes:
        if ep.get("id") == episode_id:
            ep.update(updates)
            target = ep
            break
            
    if target:
        with open(EPISODES_FILE, "w", encoding="utf-8") as f:
            json.dump(episodes, f, indent=2)
            
        # Update episode folder if exists
        for item in EPISODES_DIR.iterdir():
            if item.is_dir() and item.name.startswith(episode_id):
                meta_file = item / "meta.json"
                with open(meta_file, "w", encoding="utf-8") as f:
                    json.dump(target, f, indent=2)
                    
    return target

def sync_all_pipeline_states() -> Dict[str, Any]:
    episodes = get_all_episodes()
    if PROMPTS_FILE.exists():
        with open(PROMPTS_FILE, "r", encoding="utf-8") as f:
            prompts = json.load(f)
    else:
        prompts = []
        
    synced_count = 0
    for ep in episodes:
        ep_prompts = [p for p in prompts if p.get("episode_id") == ep["id"]]
        if ep_prompts:
            fulfilled = sum(1 for p in ep_prompts if p.get("status") == "fulfilled")
            total = len(ep_prompts)
            progress = int((fulfilled / total) * 100) if total > 0 else 0
            ep["fulfilled_prompts"] = fulfilled
            ep["total_prompts"] = total
            ep["progress"] = progress
            if progress == 100 and ep.get("status") not in ("scheduled", "published"):
                ep["status"] = "in-assembly"
                ep["stage"] = "Ready for Assembly"
            synced_count += 1
            
    with open(EPISODES_FILE, "w", encoding="utf-8") as f:
        json.dump(episodes, f, indent=2)
        
    return {"status": "success", "synced_episodes": synced_count}
