

module.exports = function (app, con) {
  // ==== Student Login Route ====
  app.post("/student_login", (req, res) => {
    const { studentId, password } = req.body;

    const sql = "SELECT session, semester FROM students WHERE roll = ? AND student_password = ?";
    con.query(sql, [studentId, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, message: "Database error" });
      }

      if (result.length > 0) {
        return res.json({
          success: true,
          session: result[0].session,
          semester: result[0].semester,
        });
      } else {
        return res.json({ success: false, message: "Invalid Student ID or Password" });
      }
    });
  });

  // ==== Teacher Login Route ====
  app.post("/teacher_login", (req, res) => {
    const { teacherId, password } = req.body;

    const sql = "SELECT * FROM teachers WHERE teachers_id = ? AND teacher_password = ?";
    con.query(sql, [teacherId, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, message: "Database error" });
      }

      if (result.length > 0) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false, message: "Invalid Teacher ID or Password" });
      }
    });
  });
};
