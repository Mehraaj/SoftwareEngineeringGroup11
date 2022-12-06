const express = require('express')  //import express
const app = express()   //calls express
const cors = require('cors');
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
  password: "password"
});


dBCon.connect(function (err) { if (err) throw err; console.log("Connected!"); });

const regExpCatalog = new RegExp('\/productcatalog.*', 'i');
const regExpCart = new RegExp('\/cart.*', 'i');
const regExpShirts = new RegExp('\/shirts.*', 'i');
const checkLogIn = new RegExp('\/checkLogIn.*', 'i');
const createVisitor = new RegExp('\/createVisitor.*', 'i');
const createMember = new RegExp('\/createMember.*', 'i');

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

function parseCookie(cookie){
  if (cookie === undefined)
    return undefined;
  const parseCookiePipe = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});

  return parseCookiePipe(cookie);
}

async function verifyAPIKey(req){
  cookiestr = req.headers.cookie;
  cookieDict = parseCookie(cookiestr);
  if (cookieDict === undefined)
    return false;
  APIKey = cookieDict.APIKey;
  if (APIKey === "None" | APIKey === undefined)
  {
    return false;
  }
  sqlStatement = "Select * from trinityfashion.Member where APIKey = \"" + APIKey + "\";";
  var resMsg = {}
  const queryResult = await new Promise((resolve, reject) => {
    dBCon.query(sqlStatement, (err, response) => {
      if (err) {
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code +
          " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
        return reject("Server Error");
      }
      else {
        resolve(response);
      }
    });
  }).then((response) => {return response;}).catch((err) => { return err; });
  
console.log(queryResult);
  if (queryResult.length !== 0) 
  {
    return true;
  }
  else
  return false;
}

app.get('/productcatalog', async (req, res) => {   //Get request for our product catalog, will show all products available
  resMsg = {};
  //console.log(req);
  check = verifyAPIKey(req);
  await check;
  result = await check.then((res) =>{ return res; })
  console.log(result);
  //parsedPath = parsingRequest(req);

  //urlParts = parsedPath[0];
  //parametersList = parsedPath[1];
  /*parametersJson = querystring.parse(parametersList);

  console.log("Parameters Json: " );
  console.log(parametersJson);
  */
  sqlStatement = "SELECT * FROM trinityfashion.productcatalog ";

  if(req.query.gender || req.query.name || req.query.category || !result){sqlStatement = sqlStatement + " WHERE ";}
  if (!result){sqlStatement = sqlStatement + " (Category = 'shirts' or Category = 'pants') ";}
  if(req.query.gender && !result) {sqlStatement = sqlStatement + " AND "}
  if(req.query.gender){sqlStatement = sqlStatement + " gender = '" + req.query.gender + "' ";}
  if(req.query.category && (!result || req.query.gender)){sqlStatement = sqlStatement + " AND ";}
  if(req.query.category){sqlStatement = sqlStatement + " Category = '" + req.query.category+ "' ";}
  if(req.query.name && (!result || req.query.gender || req.query.category)){sqlStatement = sqlStatement + " AND ";}
  if(req.query.name){sqlStatement = sqlStatement + " Name = '" + req.query.name+ "' ";}
  if (req.query.price){sqlStatement = sqlStatement + "ORDER BY Price " + req.query.price;}
/*
  if (req.query.sex && req.query.name && req.query.category){sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Category = '" + req.query.category + "' AND Sex = '" + req.query.sex + "' ";}
  else if (req.query.sex && req.query.category) {sqlStatement = sqlStatement + " WHERE Sex = '" + req.query.sex+"' AND Category = '" + req.query.category + "' ";}
  else if (req.query.name && req.query.sex) {sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Sex = '" + req.query.sex + "' ";}
  else if (req.query.name && req.query.category) {sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Category = '" + req.query.category + "' ";}
  //if (req.query.name && req.query.category) {sqlStatement = sqlStatement + " WHERE Name = '" + req.query.name+"' AND Category = '" + req.query.category + "' ";}
  else if(req.query.name){sqlStatement = sqlStatement +" WHERE Name = '" + req.query.name + "' ";}
  else if(req.query.category){sqlStatement = sqlStatement + " WHERE Category = '" + req.query.category + "' ";}
  if (req.query.price){sqlStatement = sqlStatement + "ORDER BY Price " + req.query.price;}
  */
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
      resMsg.body = JSON.parse(JSON.stringify(result));
      //console.log(result);
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
        'Access-Control-Allow-Methods': 'POST, GET,DELETE,PUT',
        'Set-Cookie' : 'APIKey=' + APIKey
      };
      res.header('Content-Type', 'application/json');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.cookie('APIKey', APIKey, {
        expires: new Date(Date.now() + 900000)});
      res.cookie('vid' , userID);
      //************************************res.setHeader('Cookie', ['type=ninja', 'language=javascript']);
      res.status(resMsg.code).send(JSON.stringify({ "APIKey": APIKey, "APIKeyDate": APIKeyDate.toString() }));
      
      console.log("Successfully found user and created API Key");
    }
  });
  console.log("Message Finished");

})

app.post(createVisitor, (req, res) => {
  resMsg = {};
  parsedPath = parsingRequest(req);
  urlParts = parsedPath[0];
  parametersList = parsedPath[1];

  randomVID = Math.floor(1000 + Math.random() * 9000);
  sqlStatement = "INSERT INTO trinityfashion.Visitor VALUES (" + randomVID + ");";

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
      res.header('Content-Type', 'application/json');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.cookie('APIKey', 'None');
      res.cookie('vid' , randomVID);
      //************************************res.setHeader('Cookie', ['type=ninja', 'language=javascript']);
      res.status(resMsg.code).send(resMsg.message);
      
      console.log("Added random visitor");
    }
  });


})

app.get("/test", async (req, res) => {
  check = verifyAPIKey(req);
  await check;
  result = await check.then((res) =>{ return res; })
  console.log(result);
  res.send(result);

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

app.post(createMember, async (req, res) => {
  resMsg = {};
  parsedPath = parsingRequest(req);
  urlParts = parsedPath[0];
  parametersList = parsedPath[1];
  bodyList = parsedPath[3];

  randomVID = Math.floor(1000 + Math.random() * 9000);
  sqlStatement = "INSERT INTO trinityfashion.Visitor VALUES (" + randomVID + ");";

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
      res.header('Content-Type', 'application/json');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.cookie('APIKey', 'None');
      res.cookie('vid' , randomVID);
      //************************************res.setHeader('Cookie', ['type=ninja', 'language=javascript']);
      res.status(resMsg.code).send(resMsg.message);
      
      console.log("Added random visitor");
}});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})