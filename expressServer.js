const express = require('express')  //import express
const app = express()   //calls express
var cors = require('cors');
app.use(cors({origin: "*",
              methods: ["GET", "POST"]
}));


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
  password: "sweg11"
});


dBCon.connect(function (err) { if (err) throw err; console.log("Connected!"); });

const regExpCatalog = new RegExp('\/productcatalog.*', 'i');
const regExpCart = new RegExp('\/cart.*', 'i');
const regExpShirts = new RegExp('\/shirts.*', 'i');
const checkLogIn = new RegExp('\/checkLogIn.*', 'i');

//example query 
/*dBCon.query('select * from trinityfashion.hats', (err, res)=>{
    return console.log(res);
  }) */

function parsingRequest(request) {
  let urlParts = [];
  let segments = request.url.split('/');

  for (i = 0, num = segments.length; i < num; i++) {
    if (segments[i] !== "") { // because of last "/" or double //
      urlParts.push(segments[i]);
    }
  }

  console.log("url Parts: ")
  console.log(urlParts);


  let parametersList = request.query;

  console.log("Parameters List: ")
  console.log(parametersList);

  requestHeaders = request.headers;
  console.log("Headers List: ");
  console.log(requestHeaders);

  bodyList = request.body;
  console.log("Body: ");
  console.log(bodyList);

  return [urlParts, parametersList, requestHeaders, bodyList];

}

app.get(regExpCatalog, (req, res) => {   //Get request for our product catalog, will show all products available
  resMsg = {};
  //console.log(req);

  parsedPath = parsingRequest(req);

  urlParts = parsedPath[0];
  parametersList = parsedPath[1];
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
      resMsg.body = JSON.parse(JSON.stringify(result));
      console.log(result);
      resMsg.code = 202;
      res.writeHead(resMsg.code, resMsg.headers);
      final = { "data": resMsg.body };
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
    + " from trinityfashion.Cart c inner join trinityfashion.ProductCatalog pc on pc.pid = c.pid) as temp where temp.vid = " + parametersList.vid + ";";
  dBCon.query(sqlpricecalc, function (err, response) {
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
    }
  });

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
      final = { "data": resMsg.body };
      final.data.push(total);
      res.end(JSON.stringify(final));
    }
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

app.get('/home', function(req, res) {
  res.sendFile('./LoginPage.html', {root: __dirname })
});

app.get(checkLogIn, async (req, res) => {   //GET request to check log in information, and create API Key 
  //console.log(req);
  console.log("Got Request");
  resMsg = {};
  parsedPath = parsingRequest(req);
  urlParts = parsedPath[0];
  parametersList = parsedPath[1];

  username = parametersList.username;
  password = parametersList.password;

  APIKey = null;
  APIKeyDate = null;

  /* 

  Add Hashing of Password Here

  */
  //var ciphertext = CryptoJS.AES.encrypt(rawdata.value, password.value);  
  //endata.value =  ciphertext.toString(); 
  //var Normaltext = CryptoJS.AES.decrypt(endata.value, password2.value);  
  //display2.textContent = Normaltext.toString(CryptoJS.enc.Utf8);


  sqlStatement = "SELECT * FROM trinityfashion.Member where username = '" + username + "' and password = '" + password + "';";

  const queryResult = await new Promise((resolve, reject) => {
    dBCon.query(sqlStatement, (err, response) => {
      if (err) {
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code +
          " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
        res.status(resMsg.code).send("Error");
        return reject("Invalid Username and Password. Please Try Again");
      }
      else {
        resolve(response);
      }
    });
  }).then((response) => JSON.parse(JSON.stringify(response))).catch((err) => { return; });

  try {
    userID = queryResult[0].VID;
  }
  catch {
    return;
  }
  console.log(userID)
  APIKey = (Math.random() + 1).toString(36).substring(7);  //Generate a random 0-6 letter code
  APIKeyDate = new Date();

  console.log(APIKeyDate);
  sqlStatement = "UPDATE trinityfashion.Member SET APIKey = '" + APIKey.toString() + "' , APIKeyDate = '" + APIKeyDate + "' WHERE vid = " + userID + " ;";

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
      resMsg.code = 201;
      resMsg.message = "Successfully Updated";
      resMsg.headers = {
        'Content-Type': 'application/json',
        'mode': 'no-cors',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET,DELETE,PUT'
      };
      res.header('Content-Type', 'application/json');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      //************************************res.setHeader('Cookie', ['type=ninja', 'language=javascript']);
      res.status(resMsg.code).send(JSON.stringify({ "APIKey": APIKey, "APIKeyDate": APIKeyDate.toString() }));
      
      console.log("Successfully found user and created API Key");
    }
  });
  console.log("Message Finished");

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})