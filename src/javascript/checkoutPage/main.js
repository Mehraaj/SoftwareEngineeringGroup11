
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
    const URL = 'http://localhost:8000/orders/tax/'+ obj.State;
    HTTP.open("GET", URL);
    HTTP.withCredentials = true;
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
    setTOTAL()
    
    }
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const string = JSON.stringify(obj)
    HTTP.send(string);
}
function setTOTAL(){
    let subtotal = document.getElementById("subtotal").innerHTML
    subtotal = subtotal.replace('$', "")
    let tax = document.getElementById("Tax").innerHTML
    tax = tax.replace('$', "")
    if(document.getElementById("Shipping").innerHTML != "FREE"){
        let Shipping = document.getElementById("Shipping").innerHTML
        Shipping = Shipping.replace('$', "")
        let total = parseFloat(subtotal)+ parseFloat(Shipping) + parseFloat(tax)
        document.getElementById("Total").innerHTML = ("$" + Math.ceil(total * 100) / 100)
    }else{
        let total = parseFloat(tax) + parseFloat(subtotal)
        document.getElementById("Total").innerHTML = ("$" + Math.ceil(total * 100) / 100)
        
    }
    
}
getDataFromCartSessionStorage()
function getDataFromCartSessionStorage(){
    let cartArr = window.sessionStorage.getItem("cart")
    cartArr = JSON.parse(cartArr)
    let subtotal = 0;
    for(let i =0; i<cartArr.length;i++){
        let temp = cartArr[i]
        let price = temp.price
        let quantity = temp.quantity
        subtotal += price *quantity
    }
    document.getElementById("subtotal").innerHTML = Math.ceil((subtotal * 100) / 100)
    console.log(document.cookie)
    if(document.cookie != null && document.cookie != "None"){
        document.getElementById("Shipping").innerHTML = "FREE"
    }
    let total = subtotal + document.getElementById("Tax")
    console.log(total)
    console.log(cartArr)
    console.log(subtotal)
}
document.getElementById("check").onclick = function(){
    SubmitButton()
}
function SubmitButton(){
    
    let cartArr = window.sessionStorage.getItem("cart")
    let x = document.getElementById("dropdown");
    let state = x.options[x.selectedIndex].value
    console.log(String(state))

    const HTTP = new XMLHttpRequest();

    const URL = 'http://localhost:8000/orders?state='+ state ;
    
    HTTP.open("POST", URL, true);
    HTTP.withCredentials = true;
    HTTP.setRequestHeader("Content-Type", "application/json");
    HTTP.onreadystatechange = () =>{
        if (HTTP.readyState === XMLHttpRequest.DONE && HTTP.status === 200){
            console.log("SUCCESS")
        }
    }
    
    HTTP.send(cartArr);
    console.log(state)
    alert("TEST STOP")
}
/*
post to /orders? state = 

in the body put 
pid color size image quantity

array of objects*/

/*



*/
OnStart()
function OnStart(){
    let cartArrWObjects = JSON.parse(window.sessionStorage.getItem("cart"))
    for(let i =0; i<cartArrWObjects.length; i++){
        let ProductName = cartArrWObjects[i].ProductName
        let ProductQuantity = cartArrWObjects[i].quantity
        let Price = Math.round(100*(ProductQuantity * cartArrWObjects[i].price))/100




        const para = document.createElement("li");
        let liContents = `
        <ul class = "CheckoutLIST"><li>${ProductName}</li><li>${ProductQuantity}</li><li>$ ${Price}</li></ul>
        ` 
        para.innerHTML = liContents

        
        let CartHTML = document.getElementsByClassName("cart")[0]
        CartHTML.appendChild(para)
    }
    
    //console.log((document.getElementsByClassName("cart")[0]).appendChild(para))

}
