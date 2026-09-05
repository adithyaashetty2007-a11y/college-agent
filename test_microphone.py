import sounddevice as sd
from scipy.io.wavfile import write

SAMPLE_RATE = 16000
DURATION = 5

print("🎤 Recording for 5 seconds...")
print("Speak now!")

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16"
)

sd.wait()

write("test.wav", SAMPLE_RATE, audio)

print("✅ Recording finished!")
print("📁 Audio saved as test.wav")