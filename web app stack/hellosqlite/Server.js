var express = require('express');
var app = express();
var http = require('http').Server(app);
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database("mydb.db");

db.serialize(function () {
    db.run("DROP TABLE question");
    db.run("CREATE TABLE if not exists question (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT, answer_a TEXT, answer_b TEXT,answer varchar(1),createdate DATETIME)");
    var stmt = db.prepare("INSERT INTO question (question,answer_a,answer_b,answer,createdate)VALUES(?,?,?,?,CURRENT_TIMESTAMP)");
    for (var i = 0; i < 10; i++) {
        var answer = "a";
        if(i%2==0){
            answer = "b";
        }
        stmt.run(["Question "+(i+1),"Yes","No",answer]);
    }
    stmt.finalize();
});

app.use('/jquery', express.static(__dirname + "/node_modules/jquery/dist"));
app.use('/', express.static(__dirname + "/public"));

app.get('/api/listquestion',function(req,res){
   var json = {items:[]};
    db.each("SELECT * FROM question",function(error,rows){
        json.items.push(rows);
   },function(){
        res.json(json);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});