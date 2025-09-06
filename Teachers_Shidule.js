// teachersRoutes.js
module.exports = (app, db) => {

  // 1️⃣ Get Teacher Info
  app.get("/api/teacher/:id", (req, res) => {
    const teacherId = req.params.id;
    const query = "SELECT name FROM teachers WHERE teachers_id = ?";

    db.query(query, [teacherId], (err, result) => {
      if (err) {
        console.error("DB error fetching teacher info:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ name: result[0]?.name || "Teacher" });
    });
  });



  // 2️⃣ Get Total Courses teacher 
  app.get("/api/teacher/:id/courses/count", (req, res) => {
    const teacherId = req.params.id;
    const query = "SELECT COUNT(*) AS total FROM courses WHERE teachers_id = ?";

    db.query(query, [teacherId], (err, result) => {
      if (err) {
        console.error("DB error fetching courses count:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ totalCourses: result[0]?.total || 0 });
    });
  });

// Get total courses for student based on session
app.get("/api/student/:studentId/courses/count", (req, res) => {
  const studentId = req.params.studentId;
  const session = req.query.session;

  const query = `
    SELECT COUNT(*) AS total
    FROM courses
    WHERE semester = ? 
  `;

  db.query(query, [session], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ totalCourses: result[0]?.total || 0 });
  });
});



  
 
// Get today's schedule for teacher
app.get("/api/teacher/:teacherId/today-schedule", (req, res) => {
  const teacherId = req.params.teacherId;
  if (!teacherId) return res.status(400).json({ error: "Teacher ID required" });

  const today = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayName = days[today.getDay()]; // e.g., "Monday"

  const query = `
    SELECT course_name, start_time, end_time, room
    FROM routine
    WHERE teachers_id = ? AND day = ?
    ORDER BY start_time ASC
  `;

  db.query(query, [teacherId, dayName], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ todayClasses: results });
  });
});




// Get today's schedule for student
app.get("/api/student/:studentId/today-schedule", (req, res) => {
  const studentId = req.params.studentId;
  const session = req.query.session;
  const day = req.query.day;

  const query = `
    SELECT course_name, start_time, end_time, room
    FROM routine
    WHERE session = ? AND day = ?
    ORDER BY start_time ASC
  `;

  db.query(query, [session, day], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ todayClasses: results });
  });
});




//Teacher weekly shidule
// Get teacher routine for a day
app.get("/api/teacher/routine/:day", (req, res) => {
  const day = req.params.day;
  const teacherId = req.query.teacherId; // from sessionStorage

  if (!teacherId || !day) {
    return res.status(400).json({ error: "Teacher ID and day are required" });
  }

  const query = `
    SELECT course_code, course_name, start_time, end_time, room
    FROM routine
    WHERE teachers_id = ? AND day = ?
    ORDER BY start_time ASC
  `;

  db.query(query, [teacherId, day], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



//----------------------------------------
// Get routine for a day + session  //students
app.get("/api/routine/:day", (req, res) => {
  const day = req.params.day;
  const session = req.query.session;

  if (!session || !day) {
    return res.status(400).json({ error: "Session and day are required" });
  }

  const query = `
    SELECT course_code, course_name, start_time, end_time, room
    FROM routine
    WHERE session = ? AND day = ?
    ORDER BY start_time ASC
  `;

  db.query(query, [session, day], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


};
