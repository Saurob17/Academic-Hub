// ==== Student Login ====
async function handleStudentLogin(event) {
  event.preventDefault();

  const studentId = document.getElementById("student-id").value;
  const password = document.getElementById("student-password").value;

  try {
    const res = await fetch("/student_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, password }),
    });

    const data = await res.json();

    if (data.success) {
      // session এবং semester ব্রাউজার storage এ রাখবো
      sessionStorage.setItem("studentId", studentId);
      sessionStorage.setItem("session", data.session);
      sessionStorage.setItem("semester", data.semester);

      window.location.href = "/Student_page.html";
    } else {
      document.getElementById("student-error").innerText = data.message;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("student-error").innerText = "Server error!";
  }
}

// ==== Teacher Login ====
async function handleTeacherLogin(event) {
  event.preventDefault();

  const teacherId = document.getElementById("teacher-id").value;
  const password = document.getElementById("teacher-password").value;

  try {
    const res = await fetch("/teacher_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId, password }),
    });

    const data = await res.json();

    if (data.success) {
      // teacher_id save
      sessionStorage.setItem("teacherId", teacherId);

      window.location.href = "/Teachers_page.html";
    } else {
      document.getElementById("teacher-error").innerText = data.message;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("teacher-error").innerText = "Server error!";
  }
}
