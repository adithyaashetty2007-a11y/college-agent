import subprocess
import os
import wave
import requests
import sounddevice as sd
from faster_whisper import WhisperModel


# =========================================================
# SETTINGS
# =========================================================

SAMPLE_RATE = 16000
RECORD_SECONDS = 5

AUDIO_FILE = "voice.wav"
TTS_FILE = "tts_output.wav"

WHISPER_MODEL = "base"
PIPER_MODEL = "en_US-lessac-medium.onnx"

RAG_API_URL = "http://localhost:8000/api/query"


# =========================================================
# LOAD WHISPER
# =========================================================

print("🧠 Loading Whisper model...")

whisper = WhisperModel(
    WHISPER_MODEL,
    device="cpu",
    compute_type="int8"
)

print("✅ Whisper loaded")


# =========================================================
# RECORD VOICE
# =========================================================

def record_voice():

    print("\n🎤 Speak now...")

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

    print("✅ Recording finished")


# =========================================================
# SPEECH TO TEXT
# =========================================================

def speech_to_text():

    print("🧠 Understanding your voice...")

    segments, info = whisper.transcribe(AUDIO_FILE)

    question = ""

    for segment in segments:
        question += segment.text

    question = question.strip()

    print("\n📝 You said:")
    print(question)

    return question


# =========================================================
# ASK RAG API
# =========================================================

def ask_rag(question):

    print("\n🤖 Asking SJEC RAG...")

    try:

        response = requests.post(
            RAG_API_URL,
            json={"query": question},
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        answer = data.get(
            "speech_text",
            "I don't have that information yet."
        )

        destination = data.get("destination_id")

        route_nodes = data.get("route_nodes", [])

        fallback = data.get("fallback", False)

        print("\n🤖 RAG Answer:")
        print(answer)

        if destination:
            print("📍 Destination:", destination)

        if route_nodes:
            print("🗺️ Route:", " → ".join(route_nodes))

        if fallback:
            print("⚠️ RAG fallback")

        return answer

    except requests.exceptions.ConnectionError:

        print("❌ Cannot connect to RAG server.")
        print("Make sure Terminal 1 is running:")
        print("python3 rag_backend/main.py")

        return "I cannot connect to the college information system right now."

    except requests.exceptions.Timeout:

        print("❌ RAG request timed out.")

        return "The college information system is taking too long to respond."

    except Exception as e:

        print("❌ RAG error:", e)

        return "Sorry, I could not process your question."


# =========================================================
# TEXT TO SPEECH
# =========================================================

def speak(answer):

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

        return

    print("🔊 Playing answer...")

    subprocess.run(["afplay", TTS_FILE])

    print("✅ Answer played")


# =========================================================
# YES / NO FOLLOW-UP
# =========================================================

def wants_more_help():

    follow_up = (
        "Can I help you with anything else?"
    )

    speak(follow_up)

    print("\n🎤 Say yes or no...")

    record_voice()

    response = speech_to_text()

    response = response.lower().strip()

    print("📝 Follow-up:", response)

    # NO responses
    no_words = [
        "no",
        "nope",
        "nothing",
        "that's all",
        "that is all",
        "stop",
        "exit",
        "bye"
    ]

    for word in no_words:

        if word in response:
            return False

    # Everything else continues
    return True


# =========================================================
# MAIN VOICE ASSISTANT
# =========================================================

def main():

    print("\n")
    print("====================================")
    print("🎓 SJEC COLLEGE VOICE ASSISTANT")
    print("====================================")

    print("\nSay your question.")

    while True:

        # ---------------------------------------------
        # RECORD QUESTION
        # ---------------------------------------------

        record_voice()

        # ---------------------------------------------
        # WHISPER
        # ---------------------------------------------

        question = speech_to_text()

        if not question:

            print("⚠️ I couldn't hear anything.")

            continue

        # ---------------------------------------------
        # ASK RAG
        # ---------------------------------------------

        answer = ask_rag(question)

        # ---------------------------------------------
        # PIPER
        # ---------------------------------------------

        speak(answer)

        # ---------------------------------------------
        # ASK IF USER NEEDS MORE HELP
        # ---------------------------------------------

        if not wants_more_help():

            speak("Okay. Have a great day!")

            print("\n👋 Voice Assistant stopped.")

            break

        print("\n🔄 Continuing conversation...")


# =========================================================
# START
# =========================================================

if __name__ == "__main__":
    main()