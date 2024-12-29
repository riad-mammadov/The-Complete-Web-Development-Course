import fs from "fs";
import qr from "qr-image";
import inquirer from "inquirer";
inquirer
    .prompt([
        {
            name: "URL",
            message: "Please enter a URL",
        },
    ]).then(function (answers) {
        const url = answers.URL;
        var qr_svg = qr.image(url);
        qr_svg.pipe(fs.createWriteStream('image.png'));
    })
    .catch((error) => {
        if (error.isTtyError) {
        } else {
        }
    });