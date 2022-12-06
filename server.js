const express = require('express')
const app = express()

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
  password: "root"
});


dBCon.connect(function(err) { if (err) throw err; console.log("Connected!");});

// HTTP request part of the URI that routes the server actions
   
const regExpCatalog = new RegExp('^\/productcatalog.*', 'i');
   
const regExpCart = new RegExp('^\/cart.*', 'i');
const regExpShirts = new RegExp('^\/shirts.*', 'i');



dBCon.query('select * from trinityfashion.hats', (err, res)=>{
  return console.log(res);
})


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

    /*query = request.url.split('?');
    let filters = querystring.parse(query[1]);
    x = JSON.parse(JSON.stringify(filters));
    console.log(x); 
 */
    //console.log(request);

    if (!resMsg.headers || resMsg.headers === null) {
      resMsg.headers = {};
    }
    if (!resMsg.headers["Content-Type"]) {
      resMsg.headers["Content-Type"] = "application/json";
    }
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
    
}

function catalog(request, response, urlParts) {
  let resMsg = {}, body = ""; 
  
  console.log(request.method);
  switch (request.method) {
    case 'GET':
      resMsg = listCatalog(request, response);
      break;

    }
  }
  
function shirts(request, response, urlParts) {
  let resMsg = {}, body = ""; 
  
  console.log(request.method);
  switch (request.method) {
    case 'GET':
      resMsg = shirtDetails(request, response);
      break;

    }
  }
  function cart(request, response, urlParts) {
    let resMsg = {}, body = ""; 
    switch (request.method) {
      case 'GET': 
      request.on('data', function(part) {  // assemble request message body
        body += part;
      }).on("end", function() { 
        console.log("Going into addcart");
        resMsg = viewCart(request, response, body);
       });

      break;

      case 'POST':
        console.log("In Post");
        request.on('data', function(part) {  // assemble request message body
          body += part;
        }).on("end", function() { 
          console.log("Going into addcart");
          resMsg = addToCart(request, response, body);
         });

        break;
      }
      return resMsg;
    }
    function addToCart(request, response, body) {
      let resMsg = {};
    
      console.log("test " + resMsg) ; 
      console.log("oejfkihu: "+ body);
     
           // process the request message body
        try {
      
          
          newItem = JSON.parse(body);
          console.log(newItem.pid);
          console.log(newItem.vid); 
          sqlStatement = "INSERT INTO trinityfashion.Cart VALUES (" + newItem.vid + "," + newItem.pid + ");";
          dBCon.query(sqlStatement, function (err, result) {
            if (err) {
              resMsg.code = 503;
              resMsg.message = "Service Unavailable";
              resMsg.body = "MySQL server error: CODE = " + err.code +
             " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
              resMsg.headers = {};
              resMsg.headers["Content-Type"] = "text/html";
              response.writeHead(resMsg.code, resMsg.headers);
              response.end(resMsg.body);
            }
            else { 
              resMsg.code = 202;
              resMsg.message = "Successfully Added";
              resMsg.headers = {};
              resMsg.headers["Content-Type"] = "text/html";
              response.writeHead(resMsg.code, resMsg.headers);
              response.end(resMsg.message);

              }
              
            } );
           }

          catch (ex) {
          resMsg.code = 500;
          resMsg.message = "Server Error";
          resMsg.headers = {};
          resMsg.headers["Content-Type"] = "text/html";
          response.writeHead(resMsg.code, resMsg.headers);
          response.end(resMsg.message);

        }
      
  }


  function viewCart(request, response, body) {
    let resMsg = {};
    let total = null; 
    query = request.url.split('?');
    let filters = querystring.parse(query[1]);
    x = JSON.parse(JSON.stringify(filters));
    console.log(x); 

    try { 
              sqlpricecalc = "select temp.vid, sum(temp.price) Total from (Select c.vid, pc.pid, pc.price"
                +" from trinityfashion.Cart c inner join trinityfashion.ProductCatalog pc on pc.pid = c.pid) as temp where temp.vid = " + x.vid + ";";
              
              dBCon.query(sqlpricecalc, function (err, res){
                if (err) {
                  resMsg.code = 503;
                  resMsg.message = "Service Unavailable";
                  resMsg.body = "MySQL server error: CODE = " + err.code +
                  " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
                  console.log(resMsg.body);
                  resMsg.headers = {};
                  resMsg.headers["Content-Type"] = "text/html";
                  response.writeHead(resMsg.code, resMsg.headers);
                  response.end(resMsg.body);
                        }
                 else {
                  total = JSON.parse(JSON.stringify(res))[0];
                  console.log(total ); 
              }});

              sqlStatement = "Select * from trinityfashion.Cart where vid = " + x.vid + ";";
              dBCon.query(sqlStatement, function (err, result) {
               if (err) {
                  resMsg.code = 503;
                  resMsg.message = "Service Unavailable";
                  resMsg.body = "MySQL server error: CODE = " + err.code +
                  " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
                  resMsg.headers["Content-Type"] = "text/html";
                  response.writeHead(resMsg.code, resMsg.headers);
                  response.end(resMsg.body);
                        }
                 else {
                 console.log(JSON.parse(JSON.stringify(result)));
                 resMsg.code = 202;
                 console.log(resMsg.code);
                 resMsg.body = JSON.parse(JSON.stringify(result));
                 response.writeHead(resMsg.code, resMsg.headers);
                 final = {"data" : resMsg.body};
                 final.data.push(total); 
                 response.end(JSON.stringify(final)); }
                        });
        }
    
        catch (ex) {
          resMsg.code = 500;
          resMsg.message = "Server Error";
        }
  }


  function listCatalog(request, response) {
    let resMsg = {}, filters = "", sqlStatement;
    // detect any filter on the URL line, or just retrieve the full collection
    query = request.url.split('?');
    console.log(query[1]+"query1");
    if (query[1] !== undefined) {
      let filters = querystring.parse(query[1]); // parses URL query to a collection of key, value pairs
      console.log(filters);
      console.log(JSON.stringify(filters));
      console.log(JSON.parse(JSON.stringify(filters)));
      x = JSON.parse(JSON.stringify(filters));
      console.log("x: " + x);
      sqlStatement = "SELECT PID, Category, Name, Color, Price, SubCategory FROM trinityfashion.productcatalog WHERE " + "Name = "+ "'"+x.name+"';";

    } else {
     
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