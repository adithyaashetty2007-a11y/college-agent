import subprocess
from database import get_location


def get_ai_response(question):

    # ==============================
    # SEARCH DATABASE
    # ==============================

    location = None

    keywords = [
        "canteen",
        "cse",
        "computer science",
        "library",
        "hostel",
        "main block",
        "mechanical",
        "admin"
    ]

    for keyword in keywords:

        if keyword in question.lower():

            location = get_location(keyword)

            if location:
                break


    # ==============================
    # PREPARE DATABASE INFORMATION
    # ==============================

    if location:

        location_data = f"""
Location: {location[0]}
Building: {location[1]}
Floor: {location[2]}
Latitude: {location[3]}
Longitude: {location[4]}
Description: {location[5]}
"""

    else:

        location_data = "No matching location found in database."


    # ==============================
    # ASK OLLAMA
    # ==============================

    prompt = f"""
You are Jarvis, an AI assistant for SJEC college.

Answer the student's question using the database information below.

DATABASE INFORMATION:
{location_data}

STUDENT QUESTION:
{question}

Rules:
- Give a short and clear answer.
- Do not invent information.
- If database information is available, use it.
- If information is unavailable, say:
  "I don't have that information yet."
"""

    print("\n🤖 Thinking...")

    result = subprocess.run(
        ["ollama", "run", "llama3.2:3b", prompt],
        capture_output=True,
        text=True
    )

    answer = result.stdout.strip()

    return answer


# ==============================
# TEST
# ==============================

if __name__ == "__main__":

    question = input("📝 Enter your question: ")

    answer = get_ai_response(question)

    print("\n🤖 AI Answer:")
    print(answer)