import sounddevice as sd
from scipy.io.wavfile import write
from faster_whisper import WhisperModel

SAMPLE_RATE = 16000
DURATION = 5

print("🧠 Loading Whisper...")

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("✅ Whisper ready!")

print("\n🎤 Speak now!")

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16"
)

sd.wait()

write("voice.wav", SAMPLE_RATE, audio)

print("✅ Recording finished!")

print("🧠 Understanding your voice...")

segments, info = model.transcribe("voice.wav")

print("\n📝 You said:")

for segment in segments:
    print(segment.text)

print("\n✅ Done!")