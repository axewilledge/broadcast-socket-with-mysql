var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "broadcast"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("DB Connected!");

});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.get('/serverpush', function (req, res) {
    con.query("SELECT * FROM candidates", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].name);
        io.emit('client get', result);
        res.sendStatus(200);
    });
});


io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});