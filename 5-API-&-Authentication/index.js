import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "username";
const yourPassword = "password";
const yourAPIKey = "3be3e6ee-ee8c-47f5-9f41-ca57b5f0be7d";
const yourBearerToken = "7a4cdaa6-a37e-4c80-9bb3-18905845c47a";
let result;

app.get("/", async (req, res) => {
  res.render("index.ejs", { content: "Your API response" });
});

app.get("/noAuth", async (req, res) => {
  try {
    const content = await axios.get(
      "https://secrets-api.appbrewery.com/random"
    );
    result = JSON.stringify(content.data);
    res.render("index.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }

  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", async (req, res) => {
  let random = Math.floor(Math.random(1 * 5) + 1);
  try {
    const content = await axios.get(
      `https://secrets-api.appbrewery.com/all?page=${random}`,
      {
        auth: {
          username: yourUsername,
          password: yourPassword,
        },
        params: { username: yourUsername },
      }
    );
    result = JSON.stringify(content.data);
    res.render("index.ejs", { content: result });
  } catch (error) {}

  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async (req, res) => {
  const content = await axios.get(
    `https://secrets-api.appbrewery.com/filter?score=5`,
    {
      params: {
        apiKey: yourAPIKey,
      },
    }
  );
  result = JSON.stringify(content.data);
  res.render("index.ejs", { content: result });
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async (req, res) => {
  const content = await axios.get(
    "https://secrets-api.appbrewery.com/secrets/42",
    {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    }
  );
  result = JSON.stringify(content.data);
  res.render("index.ejs", { content: result });
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
