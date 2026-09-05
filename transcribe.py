from faster_whisper import WhisperModel

print("🧠 Loading Whisper model...")

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("✅ Whisper loaded!")
print("🎧 Transcribing test.wav...")

segments, info = model.transcribe("test.wav")

print("\n🌐 Detected language:", info.language)

print("\n📝 You said:")

for segment in segments:
    print(segment.text)