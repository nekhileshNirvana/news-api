const express = require("express");
const cors = require('cors');
const languageRoute = require("./language/languageRoute");
const countryRoute = require("./country/countryRoute");
const articlesRoute = require("./articles/articlesRoute");
const categoryRoute = require("./category/categoryRoute");
const sourceRoute = require("./source/sourceRoute");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/", languageRoute);
app.use("/", countryRoute);
app.use("/", articlesRoute);
app.use("/", categoryRoute);
app.use("/", sourceRoute);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
