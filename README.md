# YouTube Shorts Channel Automation

Automated pipeline for generating and uploading vertical YouTube Shorts.

## Project Structure

```text
YT-Agent-Shorts/
├── .env                  # Secret keys & API credentials (IGNORED by Git)
├── .env.example          # Sample environment variables template
├── .gitignore            # Git ignore file preventing secret/media commits
├── requirements.txt      # Python dependencies
├── main.py               # Main pipeline entrypoint
├── assets/               # Background video clips, audio tracks, fonts
│   └── .gitkeep
└── src/                  # Source modules
    ├── __init__.py
    └── config.py         # Configuration and environment loader
```

## Setup & Configuration

1. **Virtual Environment**:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Secrets**:
   - The `.env` file is generated locally and ignored by Git.
   - Refer to [.env.example](file:///c:/Users/Akanksha/Desktop/Coding_to_Badiya_Se_Chal_Rahi_Hai_Bro!!/Python/Django/TechQuadra_Join_17_8_26/YT-Agent-Shorts/.env.example) for expected keys and add your actual API keys into `.env`.
