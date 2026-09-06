import sqlite3

# Connect to database
conn = sqlite3.connect("sjec.db")
cursor = conn.cursor()


# ==============================
# 1. STUDENT
# ==============================

cursor.execute("""
INSERT OR IGNORE INTO students
(name, usn, branch, semester, section)
VALUES (?, ?, ?, ?, ?)
""", (
    "Demo Student",
    "4SF23CS001",
    "CSE",
    3,
    "A"
))


# Get student ID
cursor.execute("""
SELECT id FROM students
WHERE usn = ?
""", ("4SF23CS001",))

student_id = cursor.fetchone()[0]


# ==============================
# 2. EXAM SCHEDULE
# ==============================

cursor.execute("""
INSERT INTO exams
(subject, subject_code, branch, semester, section,
 exam_date, start_time, end_time, venue)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    "Data Structures",
    "23CS301",
    "CSE",
    3,
    "A",
    "2026-09-15",
    "09:30",
    "12:30",
    "Academic Block A - Room 203"
))


cursor.execute("""
INSERT INTO exams
(subject, subject_code, branch, semester, section,
 exam_date, start_time, end_time, venue)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    "Java Programming",
    "23CS302",
    "CSE",
    3,
    "A",
    "2026-09-18",
    "09:30",
    "12:30",
    "Academic Block A - Room 204"
))


# ==============================
# 3. ATTENDANCE
# ==============================

cursor.execute("""
INSERT INTO attendance
(student_id, subject, classes_held, classes_attended, percentage)
VALUES (?, ?, ?, ?, ?)
""", (
    student_id,
    "Data Structures",
    40,
    35,
    87.5
))


cursor.execute("""
INSERT INTO attendance
(student_id, subject, classes_held, classes_attended, percentage)
VALUES (?, ?, ?, ?, ?)
""", (
    student_id,
    "Java Programming",
    40,
    37,
    92.5
))


# ==============================
# 4. CAMPUS LOCATIONS
# ==============================

cursor.execute("""
INSERT INTO locations
(name, building, floor, latitude, longitude, description)
VALUES (?, ?, ?, ?, ?, ?)
""", (
    "CSE Department",
    "Academic Block III",
    "2nd Floor",
    12.8630,
    74.8400,
    "Computer Science and Engineering Department"
))


cursor.execute("""
INSERT INTO locations
(name, building, floor, latitude, longitude, description)
VALUES (?, ?, ?, ?, ?, ?)
""", (
    "SJEC Canteen",
    "Main Block",
    "Ground Floor",
    12.8625,
    74.8405,
    "College canteen near the main block"
))


# ==============================
# SAVE
# ==============================

conn.commit()
conn.close()

print("✅ Demo data inserted successfully!")
print("👤 Student added")
print("📅 Exam schedule added")
print("📊 Attendance added")
print("📍 Campus locations added")