import sqlite3

conn = sqlite3.connect("sjec.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    usn TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL,
    semester INTEGER NOT NULL,
    section TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    subject_code TEXT,
    branch TEXT NOT NULL,
    semester INTEGER NOT NULL,
    section TEXT NOT NULL,
    exam_date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    venue TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    classes_held INTEGER,
    classes_attended INTEGER,
    percentage REAL,
    FOREIGN KEY (student_id) REFERENCES students(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    latitude REAL,
    longitude REAL,
    description TEXT
)
""")

conn.commit()
conn.close()

print("✅ SJEC database created successfully!")
print("📁 Database: sjec.db")
print("📊 Tables: students, exams, attendance, locations")