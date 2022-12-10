const appId = 'sandbox-sq0idb-iycAVETrDwv8RmQASgRRfQ';
const locationId = 'LK38JFXQTCF5Z';

async function initializeCard(payments) {
const card = await payments.card();
await card.attach('#card-container');
return card;
}

async function createPayment(token) {
console.log("TEST");
const body = JSON.stringify({
    locationId,
    sourceId: token,
});

async function getPay() {
    let cartArr = window.sessionStorage.getItem("cart")
    let x = document.getElementById("dropdown");
    let state = x.options[x.selectedIndex].value
    console.log(String(state))


    console.log("SUCCESS")
    const HTTP = new XMLHttpRequest();
    var paymentResponse;
    const URL = 'http://localhost:8000/orders?state=' + state;
    console.log("SENDING", URL);
    let orderNumber;
    HTTP.open("POST", URL, false);
    HTTP.withCredentials = true;
    HTTP.setRequestHeader("Content-Type", "application/json");
    HTTP.onreadystatechange = () => {
    if (HTTP.readyState === XMLHttpRequest.DONE && HTTP.status === 200) {
        console.log("SUCCESS")
        const check = JSON.parse(HTTP.response)
        console.log(check.orderNum)
        orderNumber = check.orderNum
        paymentResponse = getPaymentResp(orderNumber)

    }
    }
    HTTP.send(cartArr);
    console.log("DONE");
    console.log(paymentResponse)
    return paymentResponse;
}
const paymentResponse = await getPay();
async function getPaymentResp(orderNumber) {
    console.log(orderNumber)
    const paymentResp = await fetch('http://localhost:8000/orders/payment/' + orderNumber, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body,
    });
    window.location.replace("/OrderPlaced.html?ordernumber=" + orderNumber);
    return paymentResp
}
console.log(orderNumber)
//JSON.parse(orderNumber)



if (paymentResponse.ok) {
    console.log("returning");
    return paymentResponse.json();
}

const errorBody = await paymentResponse.text();
throw new Error(errorBody);
}

async function tokenize(paymentMethod) {
const tokenResult = await paymentMethod.tokenize();
if (tokenResult.status === 'OK') {
    return tokenResult.token;
} else {
    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
    if (tokenResult.errors) {
    errorMessage += ` and errors: ${JSON.stringify(
        tokenResult.errors
    )}`;
    }

    throw new Error(errorMessage);
}
}

// status is either SUCCESS or FAILURE;
function displayPaymentResults(status) {
const statusContainer = document.getElementById(
    'payment-status-container'
);
if (status === 'SUCCESS') {
    statusContainer.classList.remove('is-failure');
    statusContainer.classList.add('is-success');
} else {
    statusContainer.classList.remove('is-success');
    statusContainer.classList.add('is-failure');
}

statusContainer.style.visibility = 'visible';
}

document.addEventListener('DOMContentLoaded', async function () {
if (!window.Square) {
    throw new Error('Square.js failed to load properly');
}

let payments;
try {
    payments = window.Square.payments(appId, locationId);
} catch {
    const statusContainer = document.getElementById(
    'payment-status-container'
    );
    statusContainer.className = 'missing-credentials';
    statusContainer.style.visibility = 'visible';
    return;
}

let card;
try {
    card = await initializeCard(payments);
} catch (e) {
    console.error('Initializing Card failed', e);
    return;
}

// Checkpoint 2.
async function handlePaymentMethodSubmission(event, paymentMethod) {
    event.preventDefault();

    try {
    // disable the submit button as we await tokenization and make a payment request.
    cardButton.disabled = true;
    const token = await tokenize(paymentMethod);
    const paymentResults = await createPayment(token);
    displayPaymentResults('SUCCESS');

    console.debug('Payment Success', paymentResults);
    } catch (e) {
    cardButton.disabled = false;
    displayPaymentResults('FAILURE');
    console.error(e.message);
    }
}

const cardButton = document.getElementById('check');
cardButton.addEventListener('click', async function (event) {
    await handlePaymentMethodSubmission(event, card);
});

});


// <----------------- 1.0 ----------------->
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
// document.getElementById("check").onclick = function(){
//     SubmitButton()
// }
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
