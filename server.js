const http = require("http");
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


dBCon.connect(function(err) { if (err) throw err; console.log("Connected!");});

// HTTP request part of the URI that routes the server actions
   //--->  URI relates to "employees" collection:
const regExpCatalog = new RegExp('^\/productcatalog.*', 'i');
   //--->  URI relates to "products" collection:
const regExpCart = new RegExp('^\/cart.*', 'i');
const regExpShirts = new RegExp('^\/shirts.*', 'i');



dBCon.query('select * from trinityfashion.hats', (err, res)=>{
  return console.log(res);
})
//dBCon.end();
//let body = "";
function applicationServer(request, response) {
    let done = false, resMsg = {}; 
    // parse the URL in the request
    let urlParts = [];
    let segments = request.url.split('/');
    for (i=0, num=segments.length; i<num; i++) {
      if (segments[i] !== "") { // because of last "/" or double //
        urlParts.push(segments[i]);
      }
    }
    //console.log(request);
    console.log("AS1");
    try {
        if (done === false && regExpCatalog.test(request.url)) {
            console.log("In Catalog");
            resMsg = catalog(request,response,urlParts);
            done = true;
        }
      }
      catch(ex) {}
      console.log("AS2");
      try {
        if (done === false && regExpShirts.test(request.url)) {
            console.log("In shirt");
            resMsg = shirts(request,response,urlParts);
            done = true;
        }
      }
      catch(ex) {}
    // request processor for "employees" database collection
    console.log("AS3");
    try {
      console.log("in try");
      if (done === false && regExpCart.test(request.url)) {
          console.log("in if");
        resMsg = cart(request, response, urlParts);
        done = true;
      }
    }
    
    catch(ex) {}
    console.log("AS4");
    /*
      if (resMsg.headers === null) {
        resMsg.headers = {};
      }
      if (!resMsg.headers["Content-Type"]) {
        resMsg.headers["Content-Type"] = "application/json";
      }
      */
    // send the response message
    //console.log(resMsg.body);
    //response.writeHead(resMsg.code, resMsg.hdrs),
    //response.end(resMsg.body);
}

function catalog(request, response, urlParts) {
  let resMsg = {}, body = ""; 
  /*
  request.on("data", function(part) {  // assemble request message body
    body += part;
  }); 
  */
  console.log(request.method);
  switch (request.method) {
    case 'GET':
      resMsg = listCatalog(request, response);
      break;

    }
  }
  
function shirts(request, response, urlParts) {
  let resMsg = {}, body = ""; 
  /*
  request.on("data", function(part) {  // assemble request message body
    body += part;
  }); 
  */
  console.log(request.method);
  switch (request.method) {
    case 'GET':
      resMsg = shirtDetails(request, response);
      break;

    }
  }
  function cart(request, response, urlParts) {
    let resMsg = {}, body = ""; 
    //let resMsg = {};
    /*
    request.on('data', function(part) {  // assemble request message body
      //console.log(part);
      body += part;
      console.log(body);
    }).on("end", function() { 

      console.log(body);
    });

    */
    //console.log(request.body);
    //console.log(request.method);
    switch (request.method) {
      case 'POST':
        request.on('data', function(part) {  // assemble request message body
          //console.log(part);
          body += part;
          //console.log(body);
        }).on("end", function() { 
          resMsg = addToCart(request, response, body);
        //console.log(body);
         });;


        break;
      }
      return resMsg;
    }
    function addToCart(request, response, body) {
      let resMsg = {};
      console.log("oejfkihu: "+ body);
     /*
      request.on("end", function() {     // process the request message body
        try {
          console.log(body);
          //body += decoder.end();
          
          newItem = JSON.parse(body);
          console.log(newItem);
          //sqlStatement = "INSERT INTO trinityfashion.cart VALUES (" + newEmployee.name + "," + newEmployee.role + ", " + newEmployee.salary + ");";
          dBCon.query(sqlStatement, function (err, result) {
            if (err) {
              resMsg.code = 503;
              resMsg.message = "Service Unavailable";
              resMsg.body = "MySQL server error: CODE = " + err.code +
     " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
            }
        });
       } catch (ex) {
          resMsg.code = 500;
          resMsg.message = "Server Error";
        }
      });
      */
      return resMsg;
  }
  function listCatalog(request, response) {
    let resMsg = {}, filters = "", sqlStatement;
    // detect any filter on the URL line, or just retrieve the full collection
    query = request.url.split('?');
    console.log(query[1]+"query1");
    if (query[1] !== undefined) {
      let filters = querystring.parse(query[1]); // parses URL query to a collection of key, value pairs
      //sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('name', name, 'role', role, 'salary', salary)) FROM employees WHERE " + filters.stringify();
      console.log(filters);
      console.log(JSON.stringify(filters));
      console.log(JSON.parse(JSON.stringify(filters)));
      x = JSON.parse(JSON.stringify(filters));
      console.log("x: " + x);
      //sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('PID', PID, 'Category', Category, 'Name', Name, 'Color', Color, 'Price', Price, 'SubCategory', SubCategory)) FROM trinityfashion.productcatalog WHERE " + "Name = "+ "'"+x.name+"';";
      sqlStatement = "SELECT PID, Category, Name, Color, Price, SubCategory FROM trinityfashion.productcatalog WHERE " + "Name = "+ "'"+x.name+"';";

    } else {
      //sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('PID', PID, 'Category', Category, 'Name', Name, 'Color', Color, 'Price', Price, 'SubCategory', SubCategory)) FROM trinityfashion.productcatalog;";
      //sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('PID', PID, 'Category', Category, 'Name', Name, 'Color', Color, 'Price', Price, 'SubCategory', SubCategory)) FROM trinityfashion.productcatalog;";

      sqlStatement = "SELECT * FROM trinityfashion.productcatalog";
    }
    console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
      if (err) {
        console.log("errrorrr");
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code + " SQL of the failed query: " + err.sql + "Textual description: " + err.sqlMessage;
        //console.log(resMsg);
      } else {
        resMsg.body =  JSON.parse(JSON.stringify(result));
        console.log(result);
        resMsg.code = 202;
        response.writeHead(resMsg.code, resMsg.headers);
        final = {"data": resMsg.body};
        response.end(JSON.stringify(final));
      }
    });
    console.log("RETURN");
    return resMsg;
  }
  function shirtDetails(request, response) {
    let resMsg = {}, filters = "", sqlStatement="";
    // detect any filter on the URL line, or just retrieve the full collection
    query = request.url.split('?');
    console.log(query[1]+"query1");
    if (query[1] !== undefined) {
      let filters = querystring.parse(query[1]); // parses URL query to a collection of key, value pairs
      //sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('name', name, 'role', role, 'salary', salary)) FROM employees WHERE " + filters.stringify();
      console.log(filters);
      console.log(JSON.stringify(filters));
      console.log(JSON.parse(JSON.stringify(filters)));
      x = JSON.parse(JSON.stringify(filters));

      //sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('PID', trinityfashion.productcatalog.PID, 'Category', Category, 'Name', Name, 'Color', Color, 'Price', Price, 'SubCategory', SubCategory, 'Size', Size)) FROM trinityfashion.productcatalog INNER JOIN trinityfashion.shirts ON trinityfashion.productcatalog.PID = trinityfashion.shirts.PID WHERE trinityfashion.productcatalog.PID = " +x.PID+";";
      sqlStatement = "SELECT trinityfashion.productcatalog.PID, Category, Name, Color, Price, SubCategory, Size FROM trinityfashion.productcatalog INNER JOIN trinityfashion.shirts ON trinityfashion.productcatalog.PID = trinityfashion.shirts.PID WHERE trinityfashion.productcatalog.PID = " +x.PID+";";
    } else {
      sqlStatement = "SELECT JSON_ARRAYAGG(JSON_OBJECT('PID', PID, 'Category', Category, 'Name', Name, 'Color', Color, 'Price', Price, 'SubCategory', SubCategory)) FROM trinityfashion.productcatalog;";
      //sqlStatement = "SELECT * FROM trinityfashion.productcatalog";
    }
    console.log("sql statement: " + sqlStatement);
    console.log("TEST");
    //dBCon.connect();
    dBCon.query(sqlStatement, function (err, result) {
      if (err) {
        //console.log("errrorrr");
        resMsg.code = 503;
        resMsg.message = "Service Unavailable";
        resMsg.body = "MySQL server error: CODE = " + err.code + " SQL of the failed query: " + err.sql + "Textual description: " + err.sqlMessage;
        //console.log(resMsg);
      } else {
        resMsg.body =  JSON.parse(JSON.stringify(result));
        console.log(result);
        resMsg.code = 202;
        response.writeHead(resMsg.code, resMsg.headers);
        final = {"data": resMsg.body};
        response.end(JSON.stringify(final));
      }
    });
    // /console.log("RETURN");
    //dBCon.end();
    // /return resMsg;
  }
  const webServer = http.createServer(applicationServer);
  webServer.listen(port);