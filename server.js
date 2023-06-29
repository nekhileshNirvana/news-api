const express = require("express");
const languageRoute = require("./language/languageRoute");
const countryRoute = require("./country/countryRoute");
const articlesRoute = require("./articles/articlesRoute");
const categoryRoute = require("./category/categoryRoute");
const sourceRoute = require("./source/sourceRoute");

const app = express();
const PORT = 8080;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.use("/", languageRoute);
app.use("/", countryRoute);
app.use("/", articlesRoute);
app.use("/", categoryRoute);
app.use("/", sourceRoute);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
