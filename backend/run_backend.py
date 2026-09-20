"""
AquaScan Backend Runner
=======================
Starts the FastAPI server with hot-reload and clear terminal status.
"""

import uvicorn
import os
import sys

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    print("=" * 70)
    print("🌊 AquaScan AI Marine Debris & Anomaly Detection System (SIH26057)")
    print("🏛️  Ministry of Earth Sciences (MoES) / NIOT")
    print("⚡ Pure CPU ONNX Runtime - Edge Ready")
    print("🌐 Backend API:  http://127.0.0.1:8000")
    print("📖 Swagger Docs: http://127.0.0.1:8000/docs")
    print("=" * 70)

    uvicorn.run("api.main:app", host="127.0.0.1", port=8000, reload=True)
