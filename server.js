const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const PORT = 3000;

let games = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function Unit (owner, tile, type) {
    this.owner = owner;
    this.tile = tile;
    this.type = type;
}

function Player (country, name) {
    this.name = name;
    this.country = country;
}

function Game (host, name, map) {
    this.name = name;
    this.map = map;
    this.units = [];
    this.tiles = JSON.parse(fs.readFileSync(__dirname + "/public/maps" + map + "/tiles/tileData.json"));
    this.players = [host];
    this.round = 0;
}

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/main.html");
});

app.post("/host", (req, res) => {
    let data = req.body;

    if (data.name in games) {
        res.json({"success": false});
    } else {
        games[data.name] = new Game (data.host, data.name);
        res.json({"success": true});
    }
});

app.post("/getGame", (req, res) => {
    let data = req.body;
    if (data.name in games) {
        res.json({
            "success": true,
            "data": games[data.name]
        });
    } else {
        res.json({"success": false});
    }
});

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});