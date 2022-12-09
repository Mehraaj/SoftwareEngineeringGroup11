var searchBtn = document.getElementById("searchIconEnter");

searchBtn.addEventListener("click",searchName);

function searchName(){
  let enteredSearch = document.getElementById("search").value;
  console.log(enteredSearch);
  let url = `./searchListPage.html?productName=${enteredSearch}`
  console.log(url);
  document.getElementById("searchIconEnter").href=url;
  //location.assign(url);
  
  }

//var x = sessionStorage.getItem("cart");
//console.log(x);
//var y = JSON.parse(x);
//console.log(y[1].PID);

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

        //console.log(PID);
        //console.log(color);
        //console.log(size);
        addItemsToPage(name, color, size, image, price, quantity);
        
        //let checkout = document.getElementById("checkout");
        //checkout.addEventListener("click", checkoutPressed());
    }
    var quantityInputs = document.getElementsByClassName('quantity');
    for (let i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
        //console.log(quantity.value);
    }
    var removeInputs = document.getElementsByClassName('removeButton');
    for (let i = 0; i < removeInputs.length; i++){
        var input = removeInputs[i];
        input.addEventListener('click', removeItem);
        //console.log(quantity.value);
    }
    /*
    var page = document.getElementsByClassName('page')[0];
    var cartRows = page.getElementsByClassName('cart');
    for (let i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i];
        var quantity = cartRow.getElementsByClassName('quantity')[0];
        console.log(quantity.value);
    }
    */
   getTotal();
}
function removeItem(event){
    
    let input = event.target;
    let cart = input.parentElement;
    console.log(cart);
    let name = cart.getElementsByClassName('ProductName')[0].innerHTML;
    let size = cart.getElementsByClassName('ProductSize')[0].innerHTML;
    let color = cart.getElementsByClassName('ProductColor')[0].innerHTML;

/*
    console.log("Name: ");
    console.log(name);
    console.log("Size: ");
    console.log(size);
    console.log("Color: ");
    console.log(color);
    console.log(itemsString);
*/
    removeItemFromSession(name,size,color)
    input.parentElement.parentElement.remove();
    getTotal();
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
    //console.log(input.value);

}
function changeQuantityInSession(name,size,color,quantity){
    console.log(quantity);
    for (var i = 0; i < items.length; i++){
        //console.log("item" + i);
        if(name === items[i].ProductName && size === items[i].Size && color === items[i].color){
            //console.log("true");
            items[i].quantity = quantity;
        }
    }
    sessionStorage.setItem('cart', JSON.stringify(items));
}
function addItemsToPage(name, color, size, image, price, quantity){
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart');
    var cartItems = document.getElementsByClassName('page')[0];
    /*
    var cartRowContents =  `
        <div class="cart">
        <ul class="productImage">
        <li class="productList"><img class="productCardImage" src="./src/resources/homepage/black-shirt.jpg"></li>
        </ul>

        <ul class="productData">
        <li class="productDetails">
            <div class="ProductName">
            ${name}

            </div>
            </div>
            <div class="ProductSize">
            ${size}

            </div>
            <div class="ProductColor">
            ${color}

            </div>
        </li>
        
        </ul>
        <ul>
        <li>
            ${price}
        </li>


        </ul>
        <ul>
        <li>
            <input type="number" id="points" name="points" step="1" value = "1">
        </li>
        </ul>

        </div>`
        */
        var cartRowContents =  `
        <div class="cart">
        <ul class="productImage">
          <li class="productList"><img class="productCardImage" src="./src/resources/homepage/black-shirt.jpg"></li>
        </ul>
        
        <ul class="productData">
          <li class="productDetails">
            <div class="ProductName">${name}</div>
            <div class="ProductSize">${size}</div>
            <div class="ProductColor">${color}</div>
          </li>
          
        </ul>
        <ul>
          <li>
            ${price}
          </li>


        </ul>
        <button class="removeButton" type="button">REMOVE</button>
        <ul>
          <li>
            <input type="number" class = "quantity" id="points" name="points" step="1" value = "${quantity}">
          </li>
        </ul>

      </div>`
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    //let checkout = document.getElementsByClassName("quantity");
    //let checkout = document.getElementById("quantity");

    //console.log(checkout.value);

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
function checkoutPressed(){
    
}

getSessionStorage();

