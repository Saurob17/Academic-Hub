const teacherId = sessionStorage.getItem("teacherId");
const container = document.getElementById("courses-container");

if (!teacherId) {
    container.innerHTML = "<div class='empty-state'><div>📋</div><h3>Please login first.</h3></div>";
} else {
    fetch(`/api/courses/${teacherId}`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            container.innerHTML = "<div class='empty-state'><div>📋</div><h3>No courses assigned.</h3></div>";
            return;
        }

        data.forEach(course => {
            const div = document.createElement("div");
            div.className = "subject-card";

            div.innerHTML = `
                <div class="subject-header">
                    <h3>${course.course_name}</h3>
                    <p>Course Code: ${course.course_code} | Semester: ${course.semester}</p>
                </div>

                <div class="subject-controls">
                    <div class="control-row">
                        <label>Total Classes:</label>
                        <input type="number" id="totalClasses-${course.course_code}" value="0" min="0">
                        <button class="btn btn-small btn-success" onclick="incrementTotal(${course.course_code})">+</button>
                        <button class="btn btn-small btn-warning" onclick="decrementTotal(${course.course_code})">-</button>
                        <button class="btn btn-small btn-success" onclick="takeAttendance(${course.semester}, ${course.course_code})">Take Attendance</button>
                    </div>
                </div>

                <div class="students-list" id="students-${course.course_code}"></div>
            `;
            container.appendChild(div);
        });
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = "<div class='empty-state'><div>📋</div><h3>Error fetching courses.</h3></div>";
    });
}

const totalClassesMap = {};

function incrementTotal(courseCode) {
    const input = document.getElementById(`totalClasses-${courseCode}`);
    input.value = parseInt(input.value || 0) + 1;
    totalClassesMap[courseCode] = parseInt(input.value);
    updateAttendancePercent(courseCode);
}

function decrementTotal(courseCode) {
    const input = document.getElementById(`totalClasses-${courseCode}`);
    input.value = Math.max(0, parseInt(input.value || 0) - 1);
    totalClassesMap[courseCode] = parseInt(input.value);
    updateAttendancePercent(courseCode);
}

function takeAttendance(semester, courseCode) {
    const studentContainer = document.getElementById(`students-${courseCode}`);
    studentContainer.innerHTML = "<p>Loading students...</p>";

    fetch(`/api/students/${semester}`)
    .then(res => res.json())
    .then(students => {
        if (students.length === 0) {
            studentContainer.innerHTML = "<p>No students found for this semester.</p>";
            return;
        }

        if (!window.attendanceData) window.attendanceData = {};
        window.attendanceData[courseCode] = students.map(s => ({...s, attendedClasses:0, todayPresent:false}));

        renderStudents(courseCode);
    })
    .catch(err => {
        console.error(err);
        studentContainer.innerHTML = "<p>Error fetching students.</p>";
    });
}

function renderStudents(courseCode) {
    const studentContainer = document.getElementById(`students-${courseCode}`);
    const students = window.attendanceData[courseCode] || [];
    const totalClasses = parseInt(document.getElementById(`totalClasses-${courseCode}`).value || 0);

    studentContainer.innerHTML = students.map(student => {
        const percentage = totalClasses > 0 ? ((student.attendedClasses / totalClasses) * 100).toFixed(1) : 0;
        return `
            <div class="student-item">
                <div class="student-info">
                    <div class="student-roll">Roll: ${student.roll}</div>
                    <div class="attendance-info">
                        ${student.attendedClasses}/${totalClasses} classes (${percentage}%)
                        <span class="status-indicator ${student.todayPresent ? 'status-present' : 'status-absent'}"></span>
                    </div>
                </div>
                <div class="student-controls">
                    <input type="checkbox" class="attendance-checkbox" ${student.todayPresent ? "checked" : ""} 
                        onchange="toggleAttendance(${courseCode}, ${student.roll})">
                    <div class="attendance-controls">
                        <button class="btn btn-small btn-success" onclick="adjustAttendance(${courseCode}, ${student.roll}, 1)">+</button>
                        <button class="btn btn-small btn-warning" onclick="adjustAttendance(${courseCode}, ${student.roll}, -1)">-</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleAttendance(courseCode, studentRoll) {
    const student = window.attendanceData[courseCode].find(s => s.roll == studentRoll);
    if (!student) return;
    student.todayPresent = !student.todayPresent;
    student.attendedClasses += student.todayPresent ? 1 : -1;
    student.attendedClasses = Math.max(0, student.attendedClasses);
    renderStudents(courseCode);
}

function adjustAttendance(courseCode, studentRoll, change) {
    const student = window.attendanceData[courseCode].find(s => s.roll == studentRoll);
    if (!student) return;
    student.attendedClasses = Math.max(0, student.attendedClasses + change);
    renderStudents(courseCode);
}

function updateAttendancePercent(courseCode) {
    renderStudents(courseCode);
}