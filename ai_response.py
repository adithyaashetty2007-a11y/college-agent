import subprocess

# Load college information
with open("college_data.txt", "r") as file:
    college_data = file.read()

question = input("📝 Enter your question: ")

prompt = f"""
You are a college voice assistant.

Answer the student's question using ONLY the college information
provided below.

COLLEGE INFORMATION:
{college_data}

STUDENT QUESTION:
{question}

Instructions:
- Give a clear and short answer.
- Do not invent information.
- If the information is not available, say:
  "I don't have that information yet."
- Answer naturally like a college assistant.
"""

print("\n🤖 Thinking...\n")

result = subprocess.run(
    ["ollama", "run", "llama3.2:3b", prompt],
    capture_output=True,
    text=True
)

answer = result.stdout.strip()

print("🤖 AI Answer:")
print(answer)