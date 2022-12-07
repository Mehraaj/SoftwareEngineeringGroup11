const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const query = require("../utils/mysql");
const STATUS = require("http-status");



app.post('/checkout', (req, res) =>{   //just stores body into cookie 
    body = req.body;
    //console.log("body: " + req.body);
    res.cookie('order', req.body);
    res.send("successful");
  })
app.post('/order', (req, res) =>{
    state = req.body.state;
    cookiestr = req.headers.cookie;
    cookieDict = parseCookie(cookiestr);
    console.log(cookieDict);
    order = cookieDict.order;
    vid = cookieDict.vid;
    console.log("vid: " + vid);
    order = order.substring(2,order.length);
    console.log(order);
    orderJ = JSON.parse(order);
    // VID, PID, color, Size, quantity, orderNumber, state
    orderNum = Math.floor(10000 + Math.random() * 90000);
    console.log(orderNum);
    date = new Date();
    for (let i = 0; i < orderJ.length; i++){
      //INSERT INTO trinityfashion.orders VALUES (2, 101, 'blue', 'M', 30, 10485, 'NJ');
      //sqlStatement = "INSERT INTO trinityfashion.orders VALUES (" + vid + "," + orderJ[i].PID + ",'" + orderJ[i].color + "','" + orderJ[i].size + "'," + orderJ[i].quantity + "," + orderNum + ",'" + state + "');";
  
      sqlStatement = "INSERT INTO trinityfashion.orders VALUES (" + vid + "," + orderJ[i].PID + ",'" + orderJ[i].color + "','" + orderJ[i].size + "'," + orderJ[i].quantity + "," + orderNum + ",'" + state + "','" + date + "');";
      console.log(sqlStatement);
            dBCon.query(sqlStatement, function (err, result) {
              if (err) {
                resMsg.code = 503;
                resMsg.message = "Service Unavailable";
                resMsg.body = "MySQL server error: CODE = " + err.code +
               " SQL of the failed query: " + err.sql + " Textual description: " + err.sqlMessage;
                resMsg.headers = {};
                resMsg.headers["Content-Type"] = "text/html";
                //res.writeHead(resMsg.code, resMsg.headers);
                //res.end(resMsg.body);
                console.log("FAIL");
              }
              else {
                //res.send(JSON.stringify(result));
        
                } 
              });
      
    }
    res.clearCookie('order');
    res.send("successful");
  
  })

app.get('/cart', (req, res) => {    //GET request for cart. Will have a user parameter

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

app.post('/cart', (req, res) => {   //POST request for cart. Will have a user parameter and a product parameter

    resMsg = {};
    //console.log(req);
  
    parsedPath = parsingRequest(req);
  
    urlParts = parsedPath[0];
   // parametersList = parsedPath[1];
    bodyList = parsedPath[3];
  
    if(bodyList.add === "false"){
      sqlStatement = "DELETE FROM trinityfashion.cart WHERE vid=" + bodyList.vid + " AND pid=" + bodyList.pid + " AND size=\"" + bodyList.size + "\" AND color=\"" + bodyList.color + "\";";
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
          resMsg.message = "Successfully Removed";
          resMsg.headers = {};
          resMsg.headers["Content-Type"] = "text/html";
          res.writeHead(resMsg.code, resMsg.headers);
          res.end(resMsg.message);
          console.log("Successfully removed from cart");
      }
    });
    }
    else if (bodyList.add === "true"){
      sqlStatement = "INSERT INTO trinityfashion.cart VALUES (" + bodyList.vid + ", " + bodyList.pid + ", \"" + bodyList.size + "\", \"" + bodyList.color + "\");";
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
    }
    else{
      resMsg.message = "Add field is invalid";
      res.send(resMsg.message);
    }
  })


