
let x = document.getElementById("dropdown");
x.onchange =  function(){Abbreviation(x.options[x.selectedIndex].value)};
function Abbreviation(State){
    let newStr = "";

    for (let i = 0; i < State.length; i++) {
        if (State[i].match(/[A-Z]/)) {
            newStr += State[i];
        }
    }
    var obj = {
    State: newStr
    }
    
    
    postReq(obj);
}
function postReq(obj){
    const HTTP = new XMLHttpRequest();
    const URL = 'http://localhost:8001/tax';
    HTTP.open("POST", URL);
    HTTP.onload = () =>{
    let INFO = JSON.parse(HTTP.responseText);
    let taxRate = INFO.rate
    let TaxRate = parseFloat(taxRate)
    let subtotal = document.getElementById("subtotal").innerHTML
    subtotal = subtotal.replace('$', "")
    let SUB = parseFloat(subtotal)
    let Shipping = document.getElementById("Shipping").innerHTML
    Shipping = Shipping.replace('$', "")
    let taxed = TaxRate * SUB
    document.getElementById("Tax").innerHTML= ("$" + Math.ceil(taxed * 100) / 100)
    document.getElementById("Total").innerHTML =  ((Math.ceil(taxed * 100) / 100) + parseFloat(Shipping) + SUB)
    
    }
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const string = JSON.stringify(obj)
    HTTP.send(string);
}

