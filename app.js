const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { post } = require("request");
const app = express();

app.use(express.static("folder"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
    //res.send("HI")
});

app.post("/", function(req,res){
    const first = req.body.firstname;
    const last = req.body.lastname;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: first,
                LNAME: last
            }
        }]
    }

    const json_data = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/f890f3e0d1";
    const options = {
        method: "POST",
        auth: "aikorkem:8f73a6641282e72e48eddc36eafa2d9b-us9"
    };
    
    const request = https.request(url, options, function(response){
        const status_code = response.statusCode;

        if (status_code === 200) {
            res.sendFile(__dirname + "/success.html");
        } else   {
            res.sendFile(__dirname + "/fail.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(json_data);
    request.end();

    
});

app.post("/fail", function(req,res){
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function(){
    console.log("listening");
});

//8f73a6641282e72e48eddc36eafa2d9b-us9

//List ID
//f890f3e0d1