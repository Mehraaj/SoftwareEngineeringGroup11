// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("mainmenu");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
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
  ProdOBJ = JSON.parse(ProdOBJ)
  
  var item_name = document.getElementById("Item_Name");
  item_name.innerHTML = ProdOBJ.name

  var item_image = document.getElementById("Item_Image");
  item_image.innerHTML = "<img border-left=\none\" height=\"1001px\" width=\"755px\" src="+image+">"

  var item_name = document.getElementById("Item_Name2");
  item_name.innerHTML = ProdOBJ.name

  var item_name = document.getElementById("itemsubcategory");
  item_name.innerHTML = "Item Subcategory"

  var item_name = document.getElementById("itemprice");
  item_name.innerHTML = ProdOBJ.price
  const PID = ProdOBJ.ProductID
  window.sessionStorage.clear(); 
  requestData(PID)
  
}

function requestData(ProdID){
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/productcatalog/' + ProdID;
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log("response: ");
    console.log(HTTP.response);
    let response = HTTP.response;
    configSizes(JSON.parse(response))
    changeTopDirectory(JSON.parse(response))
    imageSetter(JSON.parse(response))
  }
  HTTP.send();
}

function imageSetter(responseObj){
  console.log(responseObj.data[0].image)//.data.Category)

  var item_image = document.getElementById("Item_Image");
  item_image.innerHTML = "<img border-left=\none\" height=\"1001px\" width=\"755px\" src="+responseObj.data[0].image+">"
}

function changeTopDirectory(responseObj){
  document.getElementById("category").innerHTML = responseObj.data[0].Category
}

function configSizes(responseObj){
  console.log(responseObj)
  let AvailableSizes = responseObj.sizes
  
  for(let i =0; i<AvailableSizes.length;i++){
    let curr = String(AvailableSizes[i])
    console.log(document.getElementById(curr))
    document.getElementById(curr).style = "display:show;"

  }
}

Start()


