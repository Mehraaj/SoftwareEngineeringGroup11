const express = require('express')  //import express
const app = express()   //calls express

// const http = require("http");  // Not sure if we need this for express

// utilities for parsing and formatting URL query strings
const querystring = require('querystring');

// MySQL database driver
const mysql = require("mysql");
const { StringDecoder } = require("string_decoder");

let decoder = new StringDecoder("utf-8");

// web server listens on the environment port or 8000
const port = (process.env.PORT || 8000);

const dBCon = mysql.createConnection({ // MySQL database
  host: "localhost",
  user: "root",
  password: "root"
});


dBCon.connect(function(err) { if (err) throw err; console.log("Connected!");});

const regExpCatalog = new RegExp('\/productcatalog.*', 'i');
const regExpCart = new RegExp('\/cart.*', 'i');
const regExpShirts = new RegExp('\/shirts.*', 'i');

//example query 
/*dBCon.query('select * from trinityfashion.hats', (err, res)=>{
    return console.log(res);
  }) */

  app.get(regExpCatalog, (req, res) => {
    resMsg = {};
    console.log(req);
    let urlParts = [];
    let segments = req.url.split('/');

    for (i=0, num=segments.length; i<num; i++) {
      if (segments[i] !== "") { // because of last "/" or double //
        urlParts.push(segments[i]);
      }
    }

    console.log("url Parts: " )
    console.log(urlParts); 


    let parametersList = req.query;

    console.log("Parameters List: ")
    console.log(parametersList);

    /*parametersJson = querystring.parse(parametersList);

    console.log("Parameters Json: " );
    console.log(parametersJson);
    */
    sqlStatement = "SELECT * FROM trinityfashion.productcatalog";

    dBCon.query(sqlStatement, function (err, result) {
      if (err) {
        console.log("A mySQL Error has Occurred");
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code + " SQL of the failed query: " + err.sql + "Textual description: " + err.sqlMessage;
        //console.log(resMsg);
      } else {
        resMsg.body =  JSON.parse(JSON.stringify(result));
        console.log(result);
        resMsg.code = 202;
        res.writeHead(resMsg.code, resMsg.headers);
        final = {"data": resMsg.body};
        res.end(JSON.stringify(final));
      }
    });

    console.log("Finished message");
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })