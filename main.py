from src.config import GEMINI_API_KEY, OUTPUT_DIR, ASSETS_DIR

def main():
    print("=========================================")
    print(" YouTube Shorts Channel Automation Agent ")
    print("=========================================")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Assets directory: {ASSETS_DIR}")
    
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        print("[!] Warning: API keys in .env are not set yet. Please update your .env file.")
    else:
        print("[+] Environment configured successfully.")

if __name__ == "__main__":
    main()
