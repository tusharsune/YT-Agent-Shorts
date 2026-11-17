import socket
import sys
import uvicorn

def get_available_port(preferred_port=8000):
    for port in [preferred_port, 8001, 8080, 8008, 5000]:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind(('127.0.0.1', port))
            s.close()
            return port
        except Exception:
            continue
    return preferred_port

if __name__ == "__main__":
    port = get_available_port(8000)
    print("=" * 60)
    print(" Pegboard — YouTube Shorts Automation Dashboard")
    print(f" Local Server: http://127.0.0.1:{port}")
    print("=" * 60)
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False)
