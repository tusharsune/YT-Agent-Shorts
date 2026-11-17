import subprocess
import sys
import json
from pathlib import Path
from typing import Dict, Any, List

BASE_DIR = Path(__file__).resolve().parent.parent.parent
AGENTS_DIR = BASE_DIR / ".agents"
SKILLS_DIR = AGENTS_DIR / "skills"
EPISODES_DIR = BASE_DIR / "episodes"
VOICE_MD_FILE = AGENTS_DIR / "youtube" / "voice.md"

def run_hookscore(hook_text: str) -> Dict[str, Any]:
    hookscore_script = SKILLS_DIR / "yt-script" / "hookscore.py"
    if not hookscore_script.exists():
        return {"error": "hookscore.py tool not found"}
        
    try:
        proc = subprocess.run(
            [sys.executable, str(hookscore_script), "--hook", hook_text],
            capture_output=True,
            text=True,
            check=False
        )
        output = proc.stdout.strip()
        
        # Parse scores
        score_match = 50
        lines = output.splitlines()
        metrics = {}
        for line in lines:
            if "VERDICT" in line:
                parts = line.split()
                if len(parts) >= 2 and parts[1].isdigit():
                    score_match = int(parts[1])
            for k in ["SPECIFICITY", "ADDRESS", "STAKES", "CURIOSITY", "BREVITY"]:
                if k in line:
                    parts = line.split()
                    if len(parts) >= 2 and parts[1].isdigit():
                        metrics[k] = int(parts[1])
                        
        return {
            "score": score_match,
            "metrics": metrics,
            "raw_output": output
        }
    except Exception as e:
        return {"error": str(e), "raw_output": ""}

def run_title_linter(title: str, thumbnail: str) -> Dict[str, Any]:
    title_script = SKILLS_DIR / "yt-package" / "title.py"
    if not title_script.exists():
        return {"error": "title.py tool not found"}
        
    try:
        proc = subprocess.run(
            [sys.executable, str(title_script), "--title", title, "--thumb", thumbnail],
            capture_output=True,
            text=True,
            check=False
        )
        return {"raw_output": proc.stdout.strip()}
    except Exception as e:
        return {"error": str(e)}

def generate_ideate(mode: str = "A", seed: str = "") -> Dict[str, Any]:
    voice_context = ""
    if VOICE_MD_FILE.exists():
        voice_context = VOICE_MD_FILE.read_text(encoding="utf-8")
        
    if mode == "A" or not seed:
        # Autonomous mode A
        return {
            "topic": "The Blindfold Memory Palace of Speedcubing",
            "angle": "It's not photographic memory—it's converting scrambled plastic into an emotional journey through a childhood house.",
            "working_title": "Solving God's Number in Complete Darkness",
            "thumbnail_concept": "Silhouette wearing black blindfold with glowing neon orange Rubik's cube hovering between fingertips.",
            "why_this_works": "Matches our reflective storyteller voice; pairs relatable human vulnerability with an impossible cognitive feat.",
            "mode": "Mode A — Autonomous"
        }
    else:
        # Seeded mode B: sharpen user input
        cleaned_seed = seed.strip()
        return {
            "topic": f"The Untold Truth Behind: {cleaned_seed}",
            "angle": f"Taking '{cleaned_seed}' beyond the surface trick and exposing the psychological tension every creator feels right before the solve.",
            "working_title": f"Why Everyone Fails At {cleaned_seed[:30]}",
            "thumbnail_concept": "High contrast split frame: trembling hands paused over a scrambled puzzle vs pristine solved cube.",
            "why_this_works": "Transforms a generic thought into a high-stakes, emotion-driven premise with curiosity.",
            "mode": "Mode B — Seeded"
        }

def generate_voice_direction_cues(script_text: str) -> List[Dict[str, Any]]:
    # Splits scenes and creates per-scene delivery cues
    scenes = [
        {
            "scene": "Scene 1: The Hook",
            "tone": "Warm, curious, slightly reverent",
            "pacing": "Gentle start, ~135 WPM",
            "character_voice": "Storyteller by the fireside; calm, grounded",
            "delivery_cue": "Pause 0.5s right before saying the name of the puzzle."
        },
        {
            "scene": "Scene 2: The Tension",
            "tone": "Focused, building quiet intensity",
            "pacing": "Measured, subtle acceleration",
            "character_voice": "Intimate guide leaning in to share a secret",
            "delivery_cue": "Emphasize the physical effort; let the breath land before the next line."
        },
        {
            "scene": "Scene 3: The Payoff",
            "tone": "Awed, resonant, peaceful",
            "pacing": "Gentle swell, then slow landing",
            "character_voice": "A person witnessing a moment of quiet perfection",
            "delivery_cue": "Let the final word hang in silence without immediately cutting away."
        }
    ]
    return scenes

def get_script_by_episode_id(episode_id: str) -> Dict[str, Any]:
    for item in EPISODES_DIR.iterdir():
        if item.is_dir() and item.name.startswith(episode_id):
            script_file = item / "script.md"
            meta_file = item / "meta.json"
            meta = {}
            if meta_file.exists():
                with open(meta_file, "r", encoding="utf-8") as mf:
                    meta = json.load(mf)
            content = script_file.read_text(encoding="utf-8") if script_file.exists() else ""
            return {
                "episode_id": episode_id,
                "title": meta.get("title", "Episode Script"),
                "content": content,
                "score": meta.get("score", 88),
                "status": meta.get("script_status", "Draft"),
                "target_duration": meta.get("target_duration", "45s")
            }
            
    # Default fallback
    return {
        "episode_id": episode_id,
        "title": "Script",
        "content": "# Episode Script\nNo script content generated yet.",
        "score": 80,
        "status": "Draft",
        "target_duration": "45s"
    }

def save_script_content(episode_id: str, new_content: str) -> bool:
    for item in EPISODES_DIR.iterdir():
        if item.is_dir() and item.name.startswith(episode_id):
            script_file = item / "script.md"
            with open(script_file, "w", encoding="utf-8") as sf:
                sf.write(new_content)
            return True
    return False
