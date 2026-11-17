import os
from pathlib import Path
from typing import Dict, Any

BASE_DIR = Path(__file__).resolve().parent.parent.parent
VOICE_MD_FILE = BASE_DIR / ".agents" / "youtube" / "voice.md"
ENV_FILE = BASE_DIR / ".env"
SKILLS_DIR = BASE_DIR / ".agents" / "skills"

def get_voice_markdown() -> str:
    if VOICE_MD_FILE.exists():
        return VOICE_MD_FILE.read_text(encoding="utf-8")
    return "# Voice Profile\nNot found"

def save_voice_markdown(content: str) -> bool:
    VOICE_MD_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(VOICE_MD_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    return True

def get_system_status() -> Dict[str, Any]:
    skills = [s.name for s in SKILLS_DIR.iterdir() if s.is_dir()] if SKILLS_DIR.exists() else []
    has_voice = VOICE_MD_FILE.exists()
    has_env = ENV_FILE.exists()
    
    return {
        "pipeline_status": "Active v1.2",
        "creator": "Alex R. (Cube Shorts Lab)",
        "skills_loaded": skills,
        "voice_profile_active": has_voice,
        "env_configured": has_env,
        "youtube_oauth": "Paused intentionally (Local Mode)",
        "gemini_api": "Manual free workflow (Google AI Pro plan active)",
        "version": "1.2.0"
    }
