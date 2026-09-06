import sqlite3

DATABASE = "sjec.db"


# ==============================
# DATABASE CONNECTION
# ==============================

def get_connection():
    return sqlite3.connect(DATABASE)


# ==============================
# GET STUDENT
# ==============================

def get_student(usn):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name, usn, branch, semester, section
        FROM students
        WHERE usn = ?
    """, (usn,))

    result = cursor.fetchone()

    conn.close()

    return result


# ==============================
# GET EXAMS
# ==============================

def get_exams(branch, semester, section):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT subject,
               subject_code,
               exam_date,
               start_time,
               end_time,
               venue
        FROM exams
        WHERE branch = ?
        AND semester = ?
        AND section = ?
        ORDER BY exam_date
    """, (branch, semester, section))

    results = cursor.fetchall()

    conn.close()

    return results


# ==============================
# GET ATTENDANCE
# ==============================

def get_attendance(usn):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT students.name,
               attendance.subject,
               attendance.classes_held,
               attendance.classes_attended,
               attendance.percentage
        FROM attendance
        JOIN students
        ON attendance.student_id = students.id
        WHERE students.usn = ?
    """, (usn,))

    results = cursor.fetchall()

    conn.close()

    return results


# ==============================
# GET CAMPUS LOCATION
# ==============================

def get_location(name):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name,
               building,
               floor,
               latitude,
               longitude,
               description
        FROM locations
        WHERE name LIKE ?
    """, (f"%{name}%",))

    result = cursor.fetchone()

    conn.close()

    return result


# ==============================
# TEST DATABASE
# ==============================

if __name__ == "__main__":

    print("\n🧪 Testing SJEC Database")
    print("========================")

    # Student
    print("\n👤 Student:")
    print(get_student("4SF23CS001"))

    # Exams
    print("\n📅 Exams:")

    exams = get_exams("CSE", 3, "A")

    for exam in exams:
        print(exam)

    # Attendance
    print("\n📊 Attendance:")

    attendance = get_attendance("4SF23CS001")

    for row in attendance:
        print(row)

    # CSE location
    print("\n📍 CSE Location:")
    print(get_location("CSE"))

    # Canteen location
    print("\n📍 Canteen Location:")
    print(get_location("Canteen"))