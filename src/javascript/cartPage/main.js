var searchBtn = document.getElementById("searchIconEnter");

searchBtn.addEventListener("click",searchName);
/*
const HTTP1 = new XMLHttpRequest();
const URL1 = 'http://localhost:8000/users?username=username&password=password';
HTTP1.open("GET", URL1);
HTTP1.withCredentials = true;
HTTP1.onload = () =>{
    console.log("response: ");
    console.log(HTTP1.response);    }
HTTP1.send();
*/
function searchName(){
  let enteredSearch = document.getElementById("search").value;
  console.log(enteredSearch);
  let url = `./searchListPage.html?productName=${enteredSearch}`
  console.log(url);
  document.getElementById("searchIconEnter").href=url; 
  }

const itemsString = sessionStorage.getItem("cart");
let items = JSON.parse(itemsString);
function getSessionStorage(){
    
    console.log(items.length);
    for(let i = 0; i < items.length; i++){
        let name = items[i].ProductName;
        let color = items[i].color;
        let size = items[i].Size;
        let price = items[i].price;
        let image = items[i].image;
        let quantity = items[i].quantity;
        addItemsToPage(name, color, size, image, price, quantity);
    }
    addListeners();
    //var checkout = document.getElementsByClassName('checkoutClass')
    getTotal();
    updateCart();
}
function addListeners(){
    var quantityInputs = document.getElementsByClassName('quantity');
    for (let i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    var removeInputs = document.getElementsByClassName('removeButton');
    for (let i = 0; i < removeInputs.length; i++){
        var input = removeInputs[i];
        input.addEventListener('click', removeItem);
    }
}
function removeItem(event){
    
    let input = event.target;
    let cart = input.parentElement;
    let name = cart.getElementsByClassName('ProductName')[0].innerHTML;
    let size = cart.getElementsByClassName('ProductSize')[0].innerHTML;
    let color = cart.getElementsByClassName('ProductColor')[0].innerHTML;

    removeItemFromSession(name,size,color)
    input.parentElement.parentElement.remove();
    getTotal();
    updateCart();
}
function removeItemFromSession(name,size,color){
    for (var i = 0; i < items.length; i++){
        //console.log("item" + i);
        if(name === items[i].ProductName && size === items[i].Size && color === items[i].color){
            //console.log("true");
            items.splice(i,1);
        }
    }
    sessionStorage.setItem('cart', JSON.stringify(items));
}
function quantityChanged(event){
    let input = event.target;
    if (input.value <=0){
        input.value = 1;
    }
    let cart = input.parentElement.parentElement.parentElement;
    let name = cart.getElementsByClassName('ProductName')[0].innerHTML;
    let size = cart.getElementsByClassName('ProductSize')[0].innerHTML;
    let color = cart.getElementsByClassName('ProductColor')[0].innerHTML;
    changeQuantityInSession(name,size,color,input.value)
    getTotal();
    updateCart();

}
function changeQuantityInSession(name,size,color,quantity){
    console.log(quantity);
    for (var i = 0; i < items.length; i++){
        if(name === items[i].ProductName && size === items[i].Size && color === items[i].color){
            items[i].quantity = quantity;
        }
    }
    sessionStorage.setItem('cart', JSON.stringify(items));
}
function addItemsToPage(name, color, size, image, price, quantity){
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart');
    var cartItems = document.getElementsByClassName('page')[0];
    
/*<div class="cart">
        <ul class="productImage">
          <li class="productList"><img class="productCardImage" src=${image}></li>
        </ul>

        <ul class="productData">
          <li class="productDetails">
            <h2>Product Name:</h2>
            <div class="ProductName">
                ${name} 
            <h2> Size:</h2>
            <div class="ProductSize">
                ${size} 
            <h2>Color:</h2>
            <div class="ProductColor">
                ${color}

            </div>
          </li>

        </ul>
        <ul>
          <li>
            <h2>Price:</h2>
              ${price}
          </li>


        </ul>

        <ul>
          <li>
            <h2>Quantity:</h2>
            <input type="number" class = "quantity" id="points" name="points" step="1" value = ${quantity}>
          </li>
        </ul>

      </div>*/

        var cartRowContents =  `
        <div class="cart">
        <ul class="productImage">
          <li class="productList"><img class="productCardImage" src=${image}></li>
        </ul>

        <ul class="productData">
          <li class="productDetails">
            <h2>Product Name:</h2>
            <div class="ProductName">${name}</div> 
            <h2> Size:</h2>
            <div class="ProductSize">${size}</div>
            <h2>Color:</h2>
            <div class="ProductColor">${color}</div>
          </li>

        </ul>
        <ul>
          <li>
            <h2>Price:</h2>
              ${price}
          </li>


        </ul>
        
        <ul>
          <li>
            <h2>Quantity:</h2>
            <input type="number" class = "quantity" id="points" name="points" step="1" value = ${quantity}>
          </li>
        </ul>
        <button class="removeButton" type="button">REMOVE</button>

      </div>`
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
}
function getTotal(){
    let sum = 0;
    for(let i = 0; i < items.length; i++){
        let price = items[i].price;
        let quantity = items[i].quantity;
        sum = sum + price*quantity;
    }
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + sum.toFixed(2);
}

function updateCart(){
    
    let newItems = JSON.parse(JSON.stringify(items));;

    for(var i = 0; i < items.length; i++){
        delete newItems[i].ProductName;
        delete newItems[i].price;
    }
    /*
    console.log(JSON.stringify(newItems));
    const HTTP1 = new XMLHttpRequest();
    const URL1 = 'http://localhost:8000/users?username=username&password=password';
    HTTP1.open("GET", URL1);
    HTTP1.withCredentials = true;
    HTTP1.onload = () =>{
        console.log("response: ");
        console.log(HTTP.response);    }
    HTTP1.send();
**/
    const HTTP = new XMLHttpRequest();

    const URL = 'http://localhost:8000/orders/cart';
    
    HTTP.open("POST", URL, true);
    HTTP.withCredentials = true;
    HTTP.setRequestHeader("Content-Type", "application/json");
    HTTP.onreadystatechange = () =>{
        if (HTTP.readyState === XMLHttpRequest.DONE && HTTP.status === 200){
            console.log("SUCCESS")
        }
    }
    
    HTTP.send(JSON.stringify(newItems));
    
}

getSessionStorage();

