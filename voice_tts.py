import subprocess

MODEL = "en_US-lessac-medium.onnx"
OUTPUT = "tts_test.wav"

text = "Hello! Welcome to our college. How can I help you today?"

print("🔊 Generating speech...")

process = subprocess.run(
    [
        "piper",
        "--model", MODEL,
        "--output_file", OUTPUT
    ],
    input=text,
    text=True
)

if process.returncode == 0:
    print("✅ Speech generated!")
    print("🔊 Playing voice...")

    subprocess.run(["afplay", OUTPUT])

    print("✅ Done!")
else:
    print("❌ Piper failed.")