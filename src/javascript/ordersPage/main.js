async function getOrders(){
    const HTTP = new XMLHttpRequest();
    const URL = 'http://localhost:8000/orders/';
    HTTP.open("GET", URL);
    HTTP.withCredentials = true;
    HTTP.onload = () =>{
        console.log("response: ");
        console.log(HTTP.response);
        let response = HTTP.response;
        this.DataObj = HTTP.response;
        window.sessionStorage.setItem("responseOBJ", response)
        configSizes(JSON.parse(response))
        changeTopDirectory(JSON.parse(response))
        imageSetterSTOCK(JSON.parse(response))
        console.log("it got here")
        configColors(JSON.parse(response))
        changeSubCat(JSON.parse(response))
      start();
    }
    HTTP.send();
}

function configColors(responseObj){
    console.log(responseObj)
    const Colors = responseObj.colors
    for(let i =0; i<Colors.length;i++){
        let curr = String(Colors[i].color);
        document.getElementById(curr).style = "display:show;"
    }
}
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

function addItemsToPage(name, color, size, image, price, quantity){
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart');
    var cartItems = document.getElementsByClassName('page')[0];
        var cartRowContents =  `
        <div class="cart">
        <ul class="productImage">
          <li class="productList"><img class="productCardImage" src="${image}"></li>
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
}