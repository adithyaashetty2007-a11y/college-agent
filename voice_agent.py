import subprocess
import os
import wave
import sounddevice as sd

# ==============================
# SETTINGS
# ==============================

SAMPLE_RATE = 16000
RECORD_SECONDS = 5

WHISPER_MODEL = "base"
OLLAMA_MODEL = "llama3.2:3b"

AUDIO_FILE = "voice.wav"
TTS_FILE = "tts_output.wav"

PIPER_MODEL = "en_US-lessac-medium.onnx"


# ==============================
# 1. LOAD COLLEGE DATA
# ==============================

with open("college_data.txt", "r") as file:
    college_data = file.read()


# ==============================
# 2. RECORD VOICE
# ==============================

print("\n🎤 College Voice Agent")
print("======================")
print("🎙️ Speak now...")

audio = sd.rec(
    int(RECORD_SECONDS * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16"
)

sd.wait()

with wave.open(AUDIO_FILE, "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    wf.writeframes(audio.tobytes())

print("✅ Recording finished!")


# ==============================
# 3. WHISPER STT
# ==============================

print("🧠 Understanding your voice...")

from faster_whisper import WhisperModel

whisper = WhisperModel(
    WHISPER_MODEL,
    device="cpu",
    compute_type="int8"
)

segments, info = whisper.transcribe(AUDIO_FILE)

question = ""

for segment in segments:
    question += segment.text

question = question.strip()

print("\n📝 You asked:")
print(question)


# ==============================
# 4. SEND QUESTION TO OLLAMA
# ==============================

prompt = f"""
You are a college voice assistant.

Use ONLY the college information below to answer the student's question.

COLLEGE INFORMATION:
{college_data}

STUDENT QUESTION:
{question}

Rules:
- Give a short, clear answer.
- Do not invent information.
- If the information is unavailable, say:
  "I don't have that information yet."
- Speak naturally like a college assistant.
"""

print("\n🤖 Thinking...")

result = subprocess.run(
    ["ollama", "run", OLLAMA_MODEL, prompt],
    capture_output=True,
    text=True
)

answer = result.stdout.strip()

print("\n🤖 AI Answer:")
print(answer)


# ==============================
# 5. PIPER TEXT TO SPEECH
# ==============================

print("\n🔊 Generating voice...")

piper_command = [
    "piper",
    "--model",
    PIPER_MODEL,
    "--output_file",
    TTS_FILE
]

process = subprocess.run(
    piper_command,
    input=answer,
    text=True,
    capture_output=True
)

if process.returncode != 0:
    print("❌ Piper error:")
    print(process.stderr)
    exit()

print("✅ Speech generated!")


# ==============================
# 6. PLAY AI VOICE
# ==============================

print("🔊 Playing answer...")

subprocess.run(["afplay", TTS_FILE])

print("✅ Done!")