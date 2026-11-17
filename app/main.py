import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from app.services import (
    episode_service,
    prompt_service,
    script_service,
    assembly_service,
    settings_service,
    auth_service
)

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = Path(__file__).resolve().parent / "static"
DATA_DIR = BASE_DIR / "data"

app = FastAPI(title="Pegboard — Cube Shorts Lab API", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Static Mounts -----------------
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if (BASE_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")

if (BASE_DIR / "episodes").exists():
    app.mount("/episodes-media", StaticFiles(directory=str(BASE_DIR / "episodes")), name="episodes-media")

@app.get("/")
def serve_index():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "Pegboard API Running. index.html not found in static directory."}

# ----------------- Authentication API (Creator Login) -----------------
@app.post("/api/auth/login")
def login_endpoint(payload: Dict[str, str]):
    username = payload.get("username", "").strip()
    password = payload.get("password", "").strip()
    res = auth_service.verify_credentials(username, password)
    if "error" in res:
        raise HTTPException(status_code=401, detail=res["error"])
    return res

@app.get("/api/auth/hint")
def password_hint_endpoint():
    return auth_service.get_password_hint()

# ----------------- Overview API -----------------
@app.get("/api/overview")
def get_overview():
    episodes = episode_service.get_all_episodes()
    prompts = prompt_service.get_prompts()
    
    pending_prompts = sum(1 for p in prompts if p.get("status") == "pending")
    in_progress = sum(1 for e in episodes if e.get("status") in ("media-pending", "in-assembly"))
    scheduled = [e for e in episodes if e.get("status") == "scheduled"]
    next_scheduled = scheduled[0] if scheduled else None
    
    # Count prompt types
    video_count = sum(1 for p in prompts if p.get("status") == "pending" and p.get("type") == "video")
    audio_count = sum(1 for p in prompts if p.get("status") == "pending" and p.get("type") == "voice")
    image_count = sum(1 for p in prompts if p.get("status") == "pending" and p.get("type") == "image")

    # Load publish log for recent entries
    pub_file = DATA_DIR / "publish_log.json"
    recent_published = []
    if pub_file.exists():
        try:
            with open(pub_file, "r", encoding="utf-8") as pf:
                recent_published = json.load(pf)[:2]
        except Exception:
            recent_published = []

    return {
        "pending_prompts_count": pending_prompts,
        "pending_breakdown": f"{video_count} video generations, {audio_count} audio stems, {image_count} image prompts waiting for fulfillment",
        "in_progress_count": in_progress,
        "next_scheduled": next_scheduled,
        "active_workbench": [e for e in episodes if e.get("status") not in ("published",)][:4],
        "recent_published": recent_published
    }

# ----------------- Episodes API -----------------
@app.get("/api/episodes")
def list_episodes(filter: Optional[str] = Query("all")):
    return episode_service.get_all_episodes(filter_stage=filter)

@app.post("/api/episodes")
def create_new_episode(payload: Dict[str, Any]):
    return episode_service.create_episode(payload)

@app.get("/api/episodes/{episode_id}")
def get_single_episode(episode_id: str):
    ep = episode_service.get_episode_by_id(episode_id)
    if not ep:
        raise HTTPException(status_code=404, detail="Episode not found")
    return ep

@app.put("/api/episodes/{episode_id}")
def update_episode_endpoint(episode_id: str, payload: Dict[str, Any]):
    updated = episode_service.update_episode(episode_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Episode not found")
    return updated

@app.post("/api/episodes/{episode_id}/assemble")
def assemble_episode_endpoint(episode_id: str):
    return assembly_service.assemble_episode_video(episode_id)

@app.post("/api/episodes/sync")
def sync_pipeline():
    return episode_service.sync_all_pipeline_states()

# ----------------- Prompts Queue API -----------------
@app.get("/api/prompts")
def list_prompts(
    status: Optional[str] = Query("all"),
    type: Optional[str] = Query("all"),
    search: Optional[str] = Query("")
):
    return prompt_service.get_prompts(status_filter=status, type_filter=type, search=search)

@app.post("/api/prompts/{prompt_id}/fulfill")
async def fulfill_prompt_endpoint(
    prompt_id: str,
    file: UploadFile = File(...)
):
    contents = await file.read()
    updated = prompt_service.fulfill_prompt_with_file(
        prompt_id=prompt_id,
        filename=file.filename,
        file_bytes=contents
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return {"status": "success", "prompt": updated}

@app.post("/api/prompts/{prompt_id}/mark-fulfilled")
def mark_prompt_fulfilled(prompt_id: str, payload: Optional[Dict[str, Any]] = None):
    prompts_file = DATA_DIR / "prompts.json"
    with open(prompts_file, "r", encoding="utf-8") as f:
        prompts = json.load(f)
    for p in prompts:
        if p["id"] == prompt_id:
            p["status"] = "fulfilled"
            p["status_label"] = "Fulfilled manually"
            p["bar_color"] = "bg-primary-container"
            break
    with open(prompts_file, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2)
    episode_service.sync_all_pipeline_states()
    return {"status": "success"}

# ----------------- Scripts API -----------------
@app.get("/api/scripts")
def list_scripts():
    episodes = episode_service.get_all_episodes()
    scripts = []
    for ep in episodes:
        s = script_service.get_script_by_episode_id(ep["id"])
        scripts.append(s)
    return scripts

@app.get("/api/scripts/{episode_id}")
def get_script(episode_id: str):
    return script_service.get_script_by_episode_id(episode_id)

@app.put("/api/scripts/{episode_id}")
def update_script(episode_id: str, payload: Dict[str, Any]):
    content = payload.get("content", "")
    saved = script_service.save_script_content(episode_id, content)
    return {"status": "success" if saved else "failed"}

@app.post("/api/scripts/hookscore")
def score_hook(payload: Dict[str, str]):
    hook = payload.get("hook", "")
    return script_service.run_hookscore(hook)

@app.post("/api/skills/ideate")
def ideate_endpoint(payload: Optional[Dict[str, Any]] = None):
    mode = (payload or {}).get("mode", "A")
    seed = (payload or {}).get("seed", "")
    return script_service.generate_ideate(mode=mode, seed=seed)

@app.post("/api/skills/voice-direction")
def voice_direction_endpoint(payload: Dict[str, Any]):
    script_text = payload.get("script", "")
    return script_service.generate_voice_direction_cues(script_text)

@app.post("/api/skills/package-lint")
def package_lint_endpoint(payload: Dict[str, str]):
    title = payload.get("title", "")
    thumb = payload.get("thumbnail", "")
    return script_service.run_title_linter(title, thumb)

# ----------------- History & Library API (Fulfilled entries from data/prompts.json) -----------------
@app.get("/api/library")
def get_library(
    episode: Optional[str] = Query("all"),
    type: Optional[str] = Query("all"),
    search: Optional[str] = Query("")
):
    prompts_file = DATA_DIR / "prompts.json"
    fulfilled_items = []
    
    if prompts_file.exists():
        with open(prompts_file, "r", encoding="utf-8") as pf:
            all_prompts = json.load(pf)
        for p in all_prompts:
            if p.get("status") == "fulfilled":
                ep_num = p.get("episode_id", "").replace("ep_", "")
                item = {
                    "id": p.get("id"),
                    "episode": ep_num,
                    "episode_title": p.get("episode_title"),
                    "type": p.get("type"),
                    "model": p.get("model") or p.get("target_tool"),
                    "title": f"{p.get('episode_title', '')} • {p.get('scene', '')}",
                    "barColor": "bg-primary-container",
                    "badgeText": "Fulfilled Asset",
                    "badgeClass": "bg-primary-container/20 text-on-primary-container",
                    "mediaPreviewType": p.get("type"),
                    "imageUrl": p.get("file_path") if p.get("type") == "image" else None,
                    "promptOrDetail": p.get("prompt_text"),
                    "tableFormat": f"{p.get('type', 'Asset').upper()} File",
                    "file_path": p.get("file_path"),
                    "fulfilled_file": p.get("fulfilled_file")
                }
                fulfilled_items.append(item)

    # Also include existing assets from assets.json if present
    assets_file = DATA_DIR / "assets.json"
    if assets_file.exists():
        try:
            with open(assets_file, "r", encoding="utf-8") as f:
                extra_assets = json.load(f)
            # avoid duplicate ids
            existing_ids = set(it["id"] for it in fulfilled_items)
            for a in extra_assets:
                if a.get("id") not in existing_ids:
                    fulfilled_items.append(a)
        except Exception:
            pass

    query = (search or "").lower().strip()
    res = []
    for a in fulfilled_items:
        if episode and episode != "all" and str(a.get("episode")) != str(episode):
            continue
        if type and type != "all" and a.get("type") != type:
            continue
        if query:
            searchable = f"{a.get('title', '')} {a.get('model', '')} {a.get('promptOrDetail', '')}".lower()
            if query not in searchable:
                continue
        res.append(a)
    return res

# ----------------- Calendar API -----------------
@app.get("/api/calendar")
def get_calendar():
    episodes = episode_service.get_all_episodes()
    return {
        "cycle": "October 2025",
        "optimal_slot": "18:00 UTC",
        "slots_filled": f"{len([e for e in episodes if e.get('status') == 'scheduled'])} of 5 weekly slots filled",
        "episodes": episodes
    }

@app.post("/api/calendar/assign")
def assign_calendar_slot(payload: Dict[str, Any]):
    episode_id = payload.get("episode_id")
    date_label = payload.get("date_label")
    updated = episode_service.update_episode(episode_id, {
        "scheduled_date": date_label,
        "status": "scheduled",
        "stage": "Scheduled for Release"
    })
    return {"status": "success", "episode": updated}

# ----------------- Publish Log API -----------------
@app.get("/api/publish-log")
def get_publish_log():
    pub_file = DATA_DIR / "publish_log.json"
    if not pub_file.exists():
        return []
    try:
        with open(pub_file, "r", encoding="utf-8") as pf:
            return json.load(pf)
    except Exception:
        return []

# ----------------- Settings API -----------------
@app.get("/api/settings")
def get_settings():
    return {
        "voice_markdown": settings_service.get_voice_markdown(),
        "system_status": settings_service.get_system_status()
    }

@app.put("/api/settings/voice")
def save_voice_settings(payload: Dict[str, str]):
    content = payload.get("voice_markdown", "")
    saved = settings_service.save_voice_markdown(content)
    return {"status": "success" if saved else "failed"}
