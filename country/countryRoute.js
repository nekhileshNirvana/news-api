const express = require("express");
const connection = require("../database");

const router = express.Router();

router.get("/country", (req, res) => {
  const query = "SELECT * FROM country"; // Replace with your table name

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Error retrieving data from MySQL" });
      return;
    }

    res.status(200).json(results);
  });
});

module.exports = router;
