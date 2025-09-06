module.exports = function(app, con) {

  // === Fetch teacher courses ===
  app.get("/api/courses/:teacherId", (req, res) => {
    const teacherId = req.params.teacherId;
    const query = "SELECT course_code, course_name, semester FROM courses WHERE teachers_id = ?";
    con.query(query, [teacherId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  });

  // === Fetch students by semester ===
  app.get("/api/students/:semester", (req, res) => {
    const semester = req.params.semester;
    const query = "SELECT roll, registration_number, session FROM students WHERE semester = ?";
    con.query(query, [semester], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  });

  //-----------------------------------------
  // === Teacher increases total classes ===
  app.post("/api/attendance/total/:courseCode/:semester/:teacherId", (req, res) => {
    const { courseCode, semester, teacherId } = req.params;
    const { change } = req.body; // +1 or -1

    const query = `
      UPDATE attendences a
      JOIN students s ON a.roll = s.roll AND s.semester = ?
      SET a.total_classes = a.total_classes + ?
      WHERE a.course_code = ? AND a.teachers_id = ?
    `;

    con.query(query, [semester, change, courseCode, teacherId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error updating total classes" });
      }
      res.json({ success: true, message: "Total classes updated" });
    });
  });

  // === Teacher marks student present/absent ===
  app.post("/api/attendance/student/:courseCode/:roll/:teacherId", (req, res) => {
    const { courseCode, roll, teacherId } = req.params;
    const { change } = req.body; // +1 or -1

    const query = `
      UPDATE attendences 
      SET attended_classes = GREATEST(0, attended_classes + ?)
      WHERE course_code = ? AND roll = ? AND teachers_id = ?
    `;

    con.query(query, [change, courseCode, roll, teacherId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Error updating student attendance" });
      }
      res.json({ success: true, message: "Student attendance updated" });
    });
  });

};
