

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("mainmenu");

// Get the offset position of the navbar
var sticky = header.offsetTop;
var DataObj;
// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

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


let search = document.getElementById("search")
search.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    document.getElementById("searchIconEnter").click();
  }
});

let ATC = document.getElementsByName("ATC");
let Counter = document.getElementById("ATCcounter")

var CartCounter = 0

for(let i =0; i<ATC.length;i++){
  ATC[i].onclick = function(){

  CartCounter++;
  Counter.style.transition = "all 0.3s ease 0s";
  Counter.style.backgroundColor = "red";
  Counter.textContent = CartCounter.toString();
}
}

const image = "http://cdn.shopify.com/s/files/1/1002/1104/files/bs_480x480.png?v=1633371444"
async function Start(){
  let ProdOBJ = window.sessionStorage.getItem('productOBJ')
  console.log("you need to look at this")
  console.log(ProdOBJ)
  ProdOBJ = JSON.parse(ProdOBJ)
  
  var item_name = document.getElementById("Item_Name");
  item_name.innerHTML = ProdOBJ.name

  var item_image = document.getElementById("Item_Image");
  item_image.innerHTML = "<img border-left=\none\" height=\"1001px\" width=\"755px\" src="+image+">"

  var item_name = document.getElementById("Item_Name2");
  item_name.innerHTML = ProdOBJ.name



  var item_name = document.getElementById("itemprice");
  item_name.innerHTML = ProdOBJ.price
  const PID = ProdOBJ.ProductID
  //window.sessionStorage.clear();  UNCOMMENT WHEN DONE
  
  requestData(PID)
  
}

function requestData(ProdID){
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/products/productCatalog/' + ProdID;
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
  }
  HTTP.send();
}
  let color = document.getElementById("dropdown");
  let SelectedColor;
  color.onchange =  function(){imageSetterChange(DataObj,color.options[color.selectedIndex].value)};
  
function imageSetterSTOCK(responseObj, color){
  // need pid category and color
  
  var item_image = document.getElementById("Item_Image");
  item_image.innerHTML = "<img border-left=\none\" height=\"1001px\" width=\"755px\" src="+responseObj.data[0].image+">"
}

console.log(sessionStorage.getItem("PID"))
function changeTopDirectory(responseObj){
  document.getElementById("category").innerHTML = responseObj.data[0].Category
}

function changeSubCat(responseObj){
  
  var item_name = document.getElementById("itemsubcategory");
  item_name.innerHTML = responseObj.data[0].SubCategory
}
function configSizes(responseObj){
  let AvailableSizes = responseObj.sizes
  let currCat = responseObj.data[0].Category
  if(currCat === "shoes" || currCat === "socks"){
    document.getElementById("dropdown1").style = "display:show;"
    for(let i =0; i<AvailableSizes.length;i++){
      let curr = String(AvailableSizes[i])
      document.getElementById(curr).style = "display:show;"
    }
  }else{
    for(let i =0; i<AvailableSizes.length;i++){
    let curr = String(AvailableSizes[i])
    document.getElementById(curr).style = "display:show;"
  }
  }

}
function configColors(responseObj){
  console.log(responseObj)
  const Colors = responseObj.colors
  for(let i =0; i<Colors.length;i++){
    let curr = String(Colors[i].color);
    document.getElementById(curr).style = "display:show;"
  }
}

Start()


const ATCBUTTON = document.getElementById("ATC")
ATCBUTTON.onclick = function(){
  AddToCart()
}


let dropdown = document.getElementById("dropdown");
dropdown.onchange =  function(){
  let selectedColor = dropdown.options[dropdown.selectedIndex].value
  let OBJ = window.sessionStorage.getItem("responseOBJ")
  let responseOBJ = JSON.parse(OBJ);
  let Colors = responseOBJ.colors
  for(let i =0; i<Colors.length;i++){
    let curr = String(Colors[i].color);
    if(Colors[i].color == selectedColor){
      var item_image = document.getElementById("Item_Image");
      item_image.innerHTML = "<img border-left=\none\" height=\"1001px\" width=\"755px\" src="+Colors[i].image+">"
      window.sessionStorage.setItem("currIMG", Colors[i].image)
      
    }
      
  }
};
/* Fields needed in cart session storage
pid:

*/

  
function AddToCart(){
  let selectedColor = dropdown.options[dropdown.selectedIndex].value
  let size;
  let responseOBJ = JSON.parse(window.sessionStorage.getItem("responseOBJ"))
  
  if(responseOBJ.data[0].Category === "shoes" || responseOBJ.data[0].Category === "socks"){
    size = window.sessionStorage.getItem("NumberSize");
  }else{
    size = window.sessionStorage.getItem("CurrSize");
  }
  
  let pid = (JSON.parse(window.sessionStorage.getItem("productOBJ"))).ProductID
  let productName = (JSON.parse(window.sessionStorage.getItem("productOBJ"))).name
  let image = window.sessionStorage.getItem("currIMG")
  let price = document.getElementById("itemprice").innerHTML
  let quantity = 1;
  let CARTOBJ = {
    "PID":pid,
    "ProductName":productName,
    "color":selectedColor,
    "Size":size,
    "image":image,
    "price":price,
    "quantity":quantity
  }
  let currCart = window.sessionStorage.getItem("cart")
  if(currCart != null){
    let flag = true
    currCart = JSON.parse(currCart)

    for(let i =0;i<currCart.length; i++){

      if (JSON.stringify(currCart[i]) == JSON.stringify(CARTOBJ)){
        flag=false
        alert("You Have Already Added a Product With The Same Size And Color Go To Cart Page To Edit Quantity")
        
      }
    }
    if(flag){
      currCart.push(CARTOBJ)
      console.log(currCart)
      let currCartObJString = JSON.stringify(currCart)
      console.log(currCartObJString)
      window.sessionStorage.setItem("cart", currCartObJString)
      alert("Successfully added to cart!")
    }
    
  }else{
    var CartArr = [];
    CartArr.push(CARTOBJ)
    console.log(CartArr)
    window.sessionStorage.setItem("cart", JSON.stringify(CartArr))
    alert("Successfully added to cart!")


  }

  
}
var ele = document.getElementsByName('size');

document.getElementById("S").onclick = function() {
  window.sessionStorage.setItem("CurrSize", "S")
  console.log(window.sessionStorage.getItem("CurrSize"))
}
document.getElementById("M").onclick = function() {
  window.sessionStorage.setItem("CurrSize", "M")
  console.log(window.sessionStorage.getItem("CurrSize"))
}
document.getElementById("L").onclick = function() {
  window.sessionStorage.setItem("CurrSize", "L")
  console.log(window.sessionStorage.getItem("CurrSize"))
}
document.getElementById("XL").onclick = function() {
  window.sessionStorage.setItem("CurrSize", "XL")
  console.log(window.sessionStorage.getItem("CurrSize"))
}
let size = document.getElementById("dropdown1");

size.onchange = function(){
  let selectedsize = size.options[size.selectedIndex].value
  window.sessionStorage.setItem("NumberSize" , selectedsize)
}


