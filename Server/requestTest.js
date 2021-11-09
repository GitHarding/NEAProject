const cors = require('cors');

const express = require("express");
const app = express();

app.use(cors({origin: 'http://localhost:3000'}));

app.use("/static", express.static(__dirname + "/static/"));

app.get("/test", (req, res) => {
    res.json({"value": "Cooookies!!"});
});

app.post("/post", (request, response) =>{
    console.log(request.body);
    response.statusCode = 200;
    response.end(true);
});


const port = 3000;
app.listen(port, () => {
    console.log("App listening on http://localhost:" + port);
});

    