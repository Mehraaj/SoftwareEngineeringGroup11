const express = require('express')  //import express
const app = express()   //calls express

// const http = require("http");  // Not sure if we need this for express

// utilities for parsing and formatting URL query strings
const querystring = require('querystring');

// MySQL database driver
const mysql = require("mysql");
const { StringDecoder } = require("string_decoder");
const { subtle } = require('crypto');

let decoder = new StringDecoder("utf-8");

// web server listens on the environment port or 8000
const port = (process.env.PORT || 8000);

const dBCon = mysql.createConnection({ // MySQL database
  host: "localhost",
  user: "root",
  password: "password"
});

dBCon.connect(function(err) { if (err) throw err; console.log("Connected!");});

const regExpCatalog = new RegExp('\/productcatalog.*', 'i');
const regExpCart = new RegExp('\/cart.*', 'i');
const regExpShirts = new RegExp('\/shirts.*', 'i');

//example query 
/*dBCon.query('select * from trinityfashion.hats', (err, res)=>{
    return console.log(res);
  }) */

    function parsingRequest(request) {
      let urlParts = [];
    let segments = request.url.split('/');

    for (i=0, num=segments.length; i<num; i++) {
      if (segments[i] !== "") { // because of last "/" or double //
        urlParts.push(segments[i]);
      }
    }

    console.log("url Parts: " )
    console.log(urlParts); 


    let parametersList = request.query;

    console.log("Parameters List: ")
    console.log(parametersList);

    return [urlParts, parametersList];

    }

  app.get('/productcatalog', (req, res) => {   //Get request for our product catalog, will show all products available
    resMsg = {};
    //console.log(req);
   
    parsedPath = parsingRequest(req);

    urlParts = parsedPath[0];
    parametersList = parsedPath[1];
    /*parametersJson = querystring.parse(parametersList);

    console.log("Parameters Json: " );
    console.log(parametersJson);
    */
    sqlStatement = "SELECT * FROM trinityfashion.productcatalog ";
    //if (req.query.sex && req.query.name && req.query.category){sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Category = '" + req.query.category + "' AND Sex = '" + req.query.sex + "' ";}
    //else if (req.query.sex && req.query.category) {sqlStatement = sqlStatement + " WHERE Sex = '" + req.query.sex+"' AND Category = '" + req.query.category + "' ";}
    //else if (req.query.name && req.query.sex) {sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Sex = '" + req.query.sex + "' ";}
    //else if (req.query.name && req.query.category) {sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Category = '" + req.query.category + "' ";}
    if (req.query.name && req.query.category) {sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Category = '" + req.query.category + "' ";}
    else if(req.query.name){sqlStatement = sqlStatement +" WHERE Name = '" + req.query.name + "' ";}
    else if(req.query.category){sqlStatement = sqlStatement + " WHERE Category = '" + req.query.category + "' ";}
    if (req.query.price){sqlStatement = sqlStatement + "ORDER BY Price " + req.query.price;}
    sqlStatement = sqlStatement + ";";
    console.log(sqlStatement);

    dBCon.query(sqlStatement, function (err, result) {
      if (err) {
        console.log("A mySQL Error has Occurred");
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code + " SQL of the failed query: " + err.sql + "Textual description: " + err.sqlMessage;
        //console.log(resMsg);
      } else {
        resMsg.body =  JSON.parse(JSON.stringify(result));
        //console.log(result);
        resMsg.code = 202;
        res.writeHead(resMsg.code, resMsg.headers);
        final = {"data": resMsg.body};
        res.end(JSON.stringify(final));
      }
    });

    console.log("Finished message");
  })

  app.get(regExpCart, (req, res) => {    //GET request for cart. Will have a user parameter

    resMsg = {};
    //console.log(req);
   
    parsedPath = parsingRequest(req);

    urlParts = parsedPath[0];
    parametersList = parsedPath[1];

    sqlpricecalc = "select temp.vid, sum(temp.price) Total from (Select c.vid, pc.pid, pc.price"
                +" from trinityfashion.Cart c inner join trinityfashion.ProductCatalog pc on pc.pid = c.pid) as temp where temp.vid = " + parametersList.vid + ";";
    
     dBCon.query(sqlpricecalc, function (err, response){
       if (err) {
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code +
        " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
        console.log(resMsg.body);
        resMsg.headers = {};
        resMsg.headers["Content-Type"] = "text/html";
        res.writeHead(resMsg.code, resMsg.headers);
        res.end(resMsg.body);
        }
         else {
      total = JSON.parse(JSON.stringify(response))[0];
      console.log(total); 
       }});    
       
       sqlStatement = "Select * from trinityfashion.Cart where vid = " + parametersList.vid + ";";
       dBCon.query(sqlStatement, function (err, response) {
       if (err) {
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code +
        " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
        resMsg.headers["Content-Type"] = "text/html";
        res.writeHead(resMsg.code, resMsg.headers);
        res.end(resMsg.body);
              }
        else {
        console.log(JSON.parse(JSON.stringify(response)));
        resMsg.code = 202;
        console.log(resMsg.code);
        resMsg.body = JSON.parse(JSON.stringify(response));
        res.writeHead(resMsg.code, resMsg.headers);
        final = {"data" : resMsg.body};
        final.data.push(total); 
        res.end(JSON.stringify(final)); }
              });
      console.log("Message Finished");

  })

  app.post(regExpCart, (req, res) => {   //POST request for cart. Will have a user parameter and a product parameter

    resMsg = {};
    //console.log(req);
   
    parsedPath = parsingRequest(req);

    urlParts = parsedPath[0];
    parametersList = parsedPath[1];
    sqlStatement = "INSERT INTO trinityfashion.Cart VALUES (" + parametersList.vid + "," + parametersList.pid + ");";

    dBCon.query(sqlStatement, function (err, result) {
      if (err) {
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code +
       " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
        resMsg.headers = {};
        resMsg.headers["Content-Type"] = "text/html";
        res.writeHead(resMsg.code, resMsg.headers);
        res.end(resMsg.body);
      }
      else { 
        resMsg.code = 202;
        resMsg.message = "Successfully Added";
        resMsg.headers = {};
        resMsg.headers["Content-Type"] = "text/html";
        res.writeHead(resMsg.code, resMsg.headers);
        res.end(resMsg.message);
        console.log("Successfully added to cart");
        } 
      });
  })
  app.get('/productcatalog/:pid', (req, res) => {
    resMsg = {};
    console.log(req.params.pid);
    pid = req.params.pid;
    //const cat = await getCategory(pid);
    //console.log(cat);
    sqlStatement = "SELECT Category FROM trinityfashion.productcatalog WHERE PID = " + pid + ";";
    //FIRST SQL QUERY TO GET CATEGORY OF PID
    
    dBCon.query(sqlStatement, function (err, result) {
      if (err) {
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code +
       " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
        resMsg.headers = {};
        resMsg.headers["Content-Type"] = "text/html";
        res.writeHead(resMsg.code, resMsg.headers);
        res.end(resMsg.body);
      }
      else { 
        console.log("Successfully queried");
        console.log(result);
        result0 = result[0];
        sqlStatement = "SELECT trinityfashion.productcatalog.PID, Category, Name, Color, Price, SubCategory, Size FROM trinityfashion.productcatalog INNER JOIN trinityfashion."+result0.Category+" ON trinityfashion.productcatalog.PID = trinityfashion."+result0.Category+".PID WHERE trinityfashion.productcatalog.PID = " +pid+";"
        //console.log(sqlStatement);
        //SECOND SQL CALL TO RETURN THE JOIN 
        dBCon.query(sqlStatement, function (err, result) {
          if (err) {
            resMsg.code = 503;
            resMsg.message = "Service Unavailable";
            resMsg.body = "MySQL server error: CODE = " + err.code +
           " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
            resMsg.headers = {};
            resMsg.headers["Content-Type"] = "text/html";
            res.writeHead(resMsg.code, resMsg.headers);
            res.end(resMsg.body);
          }
          else { 
            console.log("Successfully queried");
            console.log(result);
            res.send(result);
    
            } 
          });
        } 
      });
      

      //console.log("r1: "+ r1);
    //console.log(result);
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })