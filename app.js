var express = require("express");
var bodyParser = require("body-parser");
var validator = require('validator');

var app = express();

var models = require("./models");
models.sequelize.sync().then(function(){
    console.log("Tabelle wurde erstellt.");
    
    app.set("view engine", "ejs");
    app.set("views", __dirname + "/views");

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use("/public", express.static("public"));

    app.get("/", function(req, res){
        var key = req.query.i;
        if(typeof key == 'undefined' || key == null){
            res.render("pages/landing");
        }else{
            models.Url.find({
            where: {
                key: key
            }
        }).then(function(obj){
                if(typeof obj == 'undefined' || obj == null){
                    res.render("pages/error", {
                        error: "Es gibt deinen Link nicht."
                    });
                }else{
                res.render("pages/redirect",{
                    url: obj
                }); 
                }
        });
        }
                
    });
    
    app.post("/create", function(req, res){
        var key = createKey(req, res);
        
    }); 
    
    app.get("/created", function(req, res){
        var key = req.query.i;
        models.Url.find({
            where: {
                key: key
            }
        }).then(function(obj){
        if(typeof obj == 'undefined' || obj == null){
            res.render("pages/error",{
                error: "Bitte probiere es noch einmal."
            });
        }else{
                res.render("pages/created",{
                    url: obj
                });
            }
        })
    });

    app.listen(8080, function(){
        console.log("Webserver wurde gestartet.");
    });
});

function createKey(req, res){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        var newKey = new Array();
        for(i=0; i < 5; i++){
            newKey.push( chars.charAt( parseInt( Math.random() * chars.length, 10 ) ) );
        }
        var key = newKey.join("");
        checkKey(key, req, res);
       
    
    
}

function checkKey(key, req, res){
        models.Url.findAll({
            where: {
                key: key
            }
        }).then(function(obj){
            console.log(obj);
           if(obj == "" || obj == null){
               createEntry(key, req, res);
           }else{
               createKey(req, res);
           } 
        });
        console.log(key);
}


function createEntry(key, req, res){
    if(validator.isURL(req.body.url)){
    models.Url.create({
                url: req.body.url,
                key: key
            }).then(function(){
                res.redirect("/created?i=" + key);
            });
    }else{
        res.render("pages/error",{
            error: "Bitte gib eine gültige Url ein!"
        });
    }
}