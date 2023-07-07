const express = require("express");
const connection = require("../database");

const router = express.Router();

router.get("/articles", (req, res) => {
  const query = "SELECT * FROM articles"; // Replace with your table name

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Error retrieving data from MySQL" });
      return;
    }

    res.status(200).json(results);
  });
});

router.get("/articles/:category", (req, res) => {
  const category = req.params.category;
  const query = "SELECT * FROM articles WHERE category = ?";

  connection.query(query, [category], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Error retrieving data from MySQL" });
      return;
    }

    res.status(200).json(results);
  });
});


router.post("/articles", (req, res) => {
    const { author, content, description, publishedAt, title, url, urlToImage, country, category, language, source } = req.body;
  
    // Validate request body
    if (!author || !content || !description || !publishedAt || !title || !url || !urlToImage || !country || !category || !language || !source) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
  
    const query = "INSERT INTO articles (author, content, description, publishedAt, title, url, urlToImage, country, category, language, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [author, content, description, publishedAt, title, url, urlToImage, country, category, language, source];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error executing MySQL query:", err);
        res.status(500).json({ error: "Error inserting data into MySQL" });
        return;
      }
  
      res.status(201).json({ message: "Article created successfully" });
    });
  });
  

module.exports = router;
