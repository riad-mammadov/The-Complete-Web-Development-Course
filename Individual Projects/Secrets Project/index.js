// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://v2.jokeapi.dev/joke/Any");
        res.render("index.ejs", {
            question: response.data.setup,
            delivery: response.data.delivery
        });
    } catch (error) {
        res.status(202);
    }
});



app.listen(port, () =>
    console.log(`App listening at port ${port}`)
);

// 4. When the user goes to the home page it should render the index.ejs file.

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.
