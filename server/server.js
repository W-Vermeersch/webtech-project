const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.json({"fruits": ["apple", "orange", "banana"]});
})

app.listen(port, () => console.log("Listening on port "+ port));