import subprocess
import os
import wave
import re
import sounddevice as sd
from faster_whisper import WhisperModel

from database import (
    get_student,
    get_exams,
    get_attendance,
    get_location
)


# ============================================================
# SETTINGS
# ============================================================

SAMPLE_RATE = 16000
RECORD_SECONDS = 5

WHISPER_MODEL = "base"
OLLAMA_MODEL = "llama3.2:3b"

AUDIO_FILE = "voice.wav"
TTS_FILE = "tts_output.wav"

PIPER_MODEL = "en_US-lessac-medium.onnx"

# Piper installed through pip on your Mac
PIPER_PATH = "/Library/Frameworks/Python.framework/Versions/3.14/bin/piper"


# ============================================================
# LOAD WHISPER
# ============================================================

print("🧠 Loading Whisper...")

whisper = WhisperModel(
    WHISPER_MODEL,
    device="cpu",
    compute_type="int8"
)

print("✅ Whisper loaded!")


# ============================================================
# LOAD COLLEGE DATA
# ============================================================

try:

    with open("college_data.txt", "r") as file:
        college_data = file.read()

except FileNotFoundError:

    college_data = ""

    print("⚠️ college_data.txt not found")


# ============================================================
# RECORD VOICE
# ============================================================

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

    print("✅ Recording finished!")


# ============================================================
# SPEECH TO TEXT
# ============================================================

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


# ============================================================
# TEXT TO SPEECH
# ============================================================

def speak(text):

    print("\n🔊 Speaking...")

    piper_command = [
        PIPER_PATH,
        "--model",
        PIPER_MODEL,
        "--output_file",
        TTS_FILE
    ]

    process = subprocess.run(
        piper_command,
        input=text,
        text=True,
        capture_output=True
    )

    if process.returncode != 0:

        print("❌ Piper error:")
        print(process.stderr)

        return

    subprocess.run(
        ["afplay", TTS_FILE]
    )


# ============================================================
# DATABASE SEARCH
# ============================================================

def search_database(question):

    q = question.lower()

    print("\n🔎 Searching SJEC database...")

    # --------------------------------------------------------
    # LOCATION SEARCH
    # --------------------------------------------------------

    location_keywords = [
        "canteen",
        "cse",
        "computer science",
        "library",
        "office",
        "laboratory",
        "lab",
        "hostel",
        "auditorium",
        "department"
    ]

    for keyword in location_keywords:

        if keyword in q:

            result = get_location(keyword)

            if result:

                name, building, floor, latitude, longitude, description = result

                database_answer = f"""
Location:
Name: {name}
Building: {building}
Floor: {floor}
Description: {description}
"""

                return database_answer

    # --------------------------------------------------------
    # STUDENT SEARCH
    # --------------------------------------------------------

    # Find USN such as 4SF23CS001
    usn_match = re.search(
        r"\b\d[A-Z]{2}\d{2}[A-Z]{2}\d{3}\b",
        question.upper()
    )

    if usn_match:

        usn = usn_match.group()

        result = get_student(usn)

        if result:

            name, usn, branch, semester, section = result

            return f"""
Student Information:
Name: {name}
USN: {usn}
Branch: {branch}
Semester: {semester}
Section: {section}
"""

    # --------------------------------------------------------
    # ATTENDANCE SEARCH
    # --------------------------------------------------------

    if "attendance" in q:

        if usn_match:

            usn = usn_match.group()

            result = get_attendance(usn)

            if result:

                answer = "Attendance information:\n"

                for row in result:

                    name, subject, held, attended, percentage = row

                    answer += (
                        f"{subject}: "
                        f"{attended} out of {held} classes, "
                        f"{percentage}% attendance.\n"
                    )

                return answer

    # --------------------------------------------------------
    # NO DATABASE RESULT
    # --------------------------------------------------------

    return None


# ============================================================
# OLLAMA AI
# ============================================================

def ask_ollama(question, database_result=None):

    print("\n🤖 Thinking...")

    if database_result:

        prompt = f"""
You are the SJEC College Voice Assistant.

Answer the student's question using the database information below.

DATABASE INFORMATION:
{database_result}

STUDENT QUESTION:
{question}

Rules:

1. Use the database information.
2. Do not invent information.
3. Give a short natural answer.
4. Do not mention database tables.
5. Do not say "according to the database".
6. Speak like a helpful college assistant.
"""

    else:

        prompt = f"""
You are the SJEC College Voice Assistant.

Use ONLY the college information below.

COLLEGE INFORMATION:
{college_data}

STUDENT QUESTION:
{question}

Rules:

1. Give a short clear answer.
2. Do not invent information.
3. If the information is not available, say:
"I don't have that information yet."
4. Speak naturally like a college assistant.
"""

    result = subprocess.run(
        [
            "ollama",
            "run",
            OLLAMA_MODEL,
            prompt
        ],
        capture_output=True,
        text=True
    )

    answer = result.stdout.strip()

    if not answer:

        answer = "I don't have that information yet."

    return answer


# ============================================================
# CHECK YES / NO
# ============================================================

def wants_to_continue(question):

    q = question.lower().strip()

    # --------------------------------------------------------
    # STOP WORDS
    # --------------------------------------------------------

    stop_words = [
        "no",
        "nope",
        "nah",
        "that's all",
        "thats all",
        "nothing else",
        "nothing",
        "i'm done",
        "im done",
        "stop",
        "exit",
        "quit",
        "bye",
        "goodbye"
    ]

    for word in stop_words:

        if word in q:

            return False

    # --------------------------------------------------------
    # CONTINUE WORDS
    # --------------------------------------------------------

    continue_words = [
        "yes",
        "yeah",
        "yep",
        "sure",
        "okay",
        "ok",
        "of course",
        "please",
        "help me",
        "i have another question"
    ]

    for word in continue_words:

        if word in q:

            return True

    # If unclear, continue listening
    return True


# ============================================================
# MAIN VOICE AGENT
# ============================================================

print("\n")
print("🎓 SJEC COLLEGE VOICE ASSISTANT")
print("================================")

print("\n✅ Assistant is ready!")

print("Say 'no' when you want to stop.")


# ============================================================
# CONTINUOUS LOOP
# ============================================================

while True:

    # --------------------------------------------------------
    # LISTEN
    # --------------------------------------------------------

    record_voice()

    # --------------------------------------------------------
    # SPEECH TO TEXT
    # --------------------------------------------------------

    question = speech_to_text()

    # Ignore empty speech

    if not question:

        print("⚠️ I couldn't understand you.")

        continue


    # --------------------------------------------------------
    # SEARCH DATABASE
    # --------------------------------------------------------

    database_result = search_database(question)


    if database_result:

        print("\n📊 Database result:")

        print(database_result)

    else:

        print("\n📊 Database:")

        print("No specific database information found.")


    # --------------------------------------------------------
    # AI ANSWER
    # --------------------------------------------------------

    answer = ask_ollama(
        question,
        database_result
    )

    print("\n🤖 AI Answer:")

    print(answer)


    # --------------------------------------------------------
    # SPEAK ANSWER
    # --------------------------------------------------------

    speak(answer)


    # --------------------------------------------------------
    # ASK IF USER NEEDS ANYTHING ELSE
    # --------------------------------------------------------

    follow_up = (
        "Is there anything else I can help you with?"
    )

    print("\n🤖", follow_up)

    speak(follow_up)


    # --------------------------------------------------------
    # LISTEN FOR YES / NO
    # --------------------------------------------------------

    record_voice()

    response = speech_to_text()


    # --------------------------------------------------------
    # CHECK RESPONSE
    # --------------------------------------------------------

    if not wants_to_continue(response):

        goodbye = (
            "Okay. Thank you for using the SJEC College "
            "Voice Assistant. Goodbye!"
        )

        print("\n🤖", goodbye)

        speak(goodbye)

        break


    # --------------------------------------------------------
    # CONTINUE
    # --------------------------------------------------------

    print("\n🔄 Starting another question...")


print("\n👋 Voice Assistant stopped.")