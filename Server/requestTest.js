
const cors = require('cors');
const express = require("express");

const app = express();
app.use(express.json());

app.use(cors({origin: 'http://localhost:3000'}));
app.use("/static", express.static(__dirname + "/static/"));

const formidable = require("express-formidable")
app.use(formidable());

app.post("/send", (req, res) => { //Sends scores to Scores.json
    console.log(req.fields)
    res.send(req.fields.scores)

    //method 3
    var fs = require('fs')
    const jsonString = req.fields.scores
    fs.writeFile('Downloads/NEAProject/Server/static/Scores.json', jsonString, err => { //This needs constant changing and im not sure what to do
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
});

const port = 3000;
app.listen(port, () => {
    console.log("App listening on http://localhost:" + port);
});