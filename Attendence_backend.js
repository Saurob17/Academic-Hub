module.exports = function(app, con) {

  // Existing courses route
  app.get("/api/courses/:teacherId", (req, res) => {
    const teacherId = req.params.teacherId;
    const query = "SELECT course_code, course_name, semester FROM courses WHERE teachers_id = ?";
    con.query(query, [teacherId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  });

  // New route to fetch students by semester
  app.get("/api/students/:semester", (req, res) => {
    const semester = req.params.semester;
    const query = "SELECT roll, registration_number, session FROM students WHERE semester = ?";
    con.query(query, [semester], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  });
};
