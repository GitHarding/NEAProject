const cors = require('cors');

const express = require("express");

const app = express();
app.use(express.json());

app.use(cors({origin: 'http://localhost:3000'}));
app.use("/static", express.static(__dirname + "/static/"));

app.use(express.json());

app.use(express.bodyParser());

app.get("/old", (req, res) => {
    res.json({"value": "Cooookies!!"});
});



app.post("/send", (req, res) => {
    console.log("testing")
    console.log(req.body)
    console.log("testing")
    var fs = require('fs');
    fs.readFile('Server/static/Scores.json', (err) => {
        if(err){
            console.log(err)
        }else{
            const data = JSON.parse(req.body)
                console.log(data.address)
                res.send

            }
        
    });

});

app.post("/post", (req, res) =>{
    console.log(req.body);
    res.statusCode = 200;
    res.end(true);
});


const port = 3000;
app.listen(port, () => {
    console.log("App listening on http://localhost:" + port);
});