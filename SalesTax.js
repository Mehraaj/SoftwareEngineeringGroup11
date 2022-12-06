var SalesTax = require('sales-tax');

//SalesTax.getSalesTax(stateCode:)

const express = require('express')  //import express
const app = express()   //calls express
var cors = require('cors');
const res = require('express/lib/response');
app.use(cors({origin: "*",
              methods: ["GET", "POST"]
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
const port = (process.env.PORT || 8001);
app.post('/tax',(req, res) =>{
    console.log(req.body);
    
    SalesTax.getSalesTax("US", req.body.State).then((tax)=>{res.status(201).send(tax)});
    
    
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })