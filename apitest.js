const http = require("http");
// utilities for parsing and formatting URL query strings
const querystr = require("querystring");

// MySQL database driver
const mysql = require("mysql");

// web server listens on the environment port or 8000
const port = process.env.PORT || 8000;

const dBCon = mysql.createConnection({
  // MySQL database
  host: "localhost",
  user: "root",
  password: "root",
});

dBCon.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// HTTP request part of the URI that routes the server actions
//--->  URI relates to "employees" collection:
const regExpEmployees = new RegExp("^/employees/.*", "i");
//--->  URI relates to "products" collection:
const regExpProducts = new RegExp("^/products/.*", "i");

dBCon.query("select * from trinityfashion.hats", (err, res) => {
  return console.log(res);
});

function applicationServer(request, response) {
  let done = false,
    resMsg = {};
  // parse the URL in the request
  let urlParts = [];
  let segments = request.url.split("/");
  for (i = 0, num = segments.length; i < num; i++) {
    if (segments[i] !== "") {
      // because of last "/" or double //
      urlParts.push(segments[i]);
    }
  }
  //console.log(request);

  try {
    if (done === false && regExpEmployees.test(request.url)) {
      console.log(request.method);
      done = true;
    }
  } catch (ex) {}
  // request processor for "employees" database collection
  /*
    try {
      if (done === false && regExpEmployees.test(request.url)) {
        resMsg = employees(req, res, urlParts);
        done = true;
      }
    }
    catch(ex) { ... } 
    // request processor for "products" database collection
    try {
      if (done === false && regExpProducts.test(request.url)) {
        resMsg = products(req, res, urlParts);
        done = true;
      }
    }
    catch(ex) { ... }
    */
}
/*
function employees(request, response, urlParts) {
  let resMsg = {}, body = ""; 
  request.on("data", function(part) {  // assemble request message body
    body += part;
  }); 
  switch (request.method) {
    case 'GET':
      resMsg = listEmployees(request, response);
      break;
    case 'POST':
      if (urlParts[1]) {
        switch (parts[1].toLowerCase()) {
          case "assign":
            assignToCustomer(request, response, urlParts[2], body);
            break;
          case " ... ":
            ...
            break;
        }
      } else {
        resMsg = addEemployee(request, response, body);
      }
      break;
    case ... // include the HTTP methods PUT/PATCH, DELETE, etc.
      ...
 
    default:
    }
  }
  */
const webServer = http.createServer(applicationServer);
webServer.listen(port);
