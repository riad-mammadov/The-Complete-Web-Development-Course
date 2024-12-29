import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "password",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let errormessage;

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let visitedcountries = [];
  result.rows.forEach((country) => {
    visitedcountries.push(country.country_code);
  });
  return visitedcountries;
}

app.get("/", async (req, res) => {
  const visitedcountries = await checkVisisted();
  res.render("index.ejs", {
    countries: visitedcountries,
    total: visitedcountries.length,
    error: errormessage || "",
  });
});

app.post("/add", async (req, res) => {
  const result = req.body["country"];
  const capitalise = result[0].toUpperCase() + result.slice(1);

  const select = await db.query(
    "SELECT country_code FROM world_countries WHERE country_name = $1",
    [capitalise]
  );

  if (select.rows.length !== 0) {
    const insertedCountry = select.rows[0].country_code;

    const checkDatabase = await db.query(
      "SELECT * from visited_countries WHERE country_code = $1",
      [insertedCountry]
    );

    if (checkDatabase.rows.length !== 0) {
      const visitedcountries = await checkVisisted();
      errormessage = "Country already inputted";
      res.render("index.ejs", {
        countries: visitedcountries,
        total: visitedcountries.length,
        error: errormessage,
      });
    } else {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [insertedCountry]
      );
      res.redirect("/");
    }
  } else {
    try {
      const findCountry = await db.query(
        "SELECT country_code FROM world_countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
        [findCountry.toLowerCase()]
      );

      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [findCountry]
      );
      res.redirect("/");
    } catch (error) {
      const visitedcountries = await checkVisisted();
      errormessage = "Country does not exist";
      res.render("index.ejs", {
        countries: visitedcountries,
        total: visitedcountries.length,
        error: errormessage,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
