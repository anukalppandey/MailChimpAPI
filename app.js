require("dotenv").config();
const express = require("express");
const bp = require("body-parser");
const https = require("https");
const { response } = require("express");

var app = express();
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res)=>{
    var fName = req.body.fname;
    var lName = req.body.lname;
    var Email = req.body.mail;
    var Data = {
        members:[
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    Data = JSON.stringify(Data); 
    var url = "https://us8.api.mailchimp.com/3.0/lists/" + process.env.LISTID
    var options = {
        method: "post",
        auth: "Anukalp:" + process.env.APIKEY
    };

    const sendToMailChimp = https.request(url, options, (response)=>{

        if(response.statusCode===200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
    });
    sendToMailChimp.write(Data);
    sendToMailChimp.end();
});

app.post("/failure", (req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started at port 3000");
}); 

