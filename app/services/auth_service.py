"""
Authentication Service for Pegboard Studio
Single-creator secure credential authentication with hint helper.
"""

from typing import Dict, Any

VALID_USERNAME = "Tushar"
VALID_PASSWORD = "Tushar..2411"
PASSWORD_HINT = "ar.. is in the pass"

def verify_credentials(username: str, password: str) -> Dict[str, Any]:
    norm_user = (username or "").strip()
    norm_pass = (password or "").strip()

    if not norm_user or not norm_pass:
        return {"error": "Username and password are required."}

    # Case-insensitive username match, exact password match
    if norm_user.lower() != VALID_USERNAME.lower():
        return {"error": "Invalid username. Only authorized creator can log in."}

    if norm_pass != VALID_PASSWORD:
        return {"error": "Incorrect password. Click 'Forgot password?' for a hint."}

    return {
        "status": "success",
        "user": {
            "name": "Tushar",
            "username": "Tushar",
            "role": "Creator & Lead Producer",
            "channel": "Cube Shorts Lab"
        }
    }

def get_password_hint() -> Dict[str, str]:
    return {
        "hint": PASSWORD_HINT,
        "message": f"Security Reminder: {PASSWORD_HINT}"
    }
