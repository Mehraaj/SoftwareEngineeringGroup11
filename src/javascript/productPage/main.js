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
  window.sessionStorage.setItem("PID", PID)
  requestData(PID)
  
}

function requestData(ProdID){
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/products/productCatalog/' + ProdID;
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log("response: ");
    console.log(HTTP.response);
    let response = HTTP.response;
    this.DataObj = HTTP.response;
    configSizes(JSON.parse(response))
    changeTopDirectory(JSON.parse(response))
    imageSetterSTOCK(JSON.parse(response))
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
function imageSetterChange(responseObj, color){
  // need pid category and color
  /*let category = responseObj.data[0].Category
  let pid = responseObj.data[0].PID
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/getItemImage' + ProdID;
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log("response: ");
    console.log(HTTP.response);
    let response = HTTP.response;
    this.DataObj = HTTP.response;
    configSizes(JSON.parse(response))
    changeTopDirectory(JSON.parse(response))
    imageSetter(JSON.parse(response))
    configColors(JSON.parse(response))
    changeSubCat(JSON.parse(response))
  }
  HTTP.send();*/
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/products/productCatalog/' + sessionStorage.getItem("PID");
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log("response: ");
    console.log(HTTP.response);
    let response = HTTP.response;
    responseObj =JSON.parse(response)
    var item_image = document.getElementById("Item_Image");
    item_image.innerHTML = "<img border-left=\none\" height=\"1001px\" width=\"755px\" src="+"./productImages/"+String(color) +responseObj.data.name +">"
    console.log((responseObj.data[0].Name).split(" ").join(""))
  }
  HTTP.send();
  
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
  for(let i =0; i<AvailableSizes.length;i++){
    let curr = String(AvailableSizes[i])
    document.getElementById(curr).style = "display:show;"
  }
}
function configColors(responseObj){
  const Colors = responseObj.colors
  for(let i =0; i<Colors.length;i++){
    let curr = String(Colors[i]);
    document.getElementById(curr).style = "display:show;"
  }
}

Start()


const ATCBUTTON = document.getElementById("ATC")
ATCBUTTON.onclick = function(){
  let testObj = {
    "vid":"001",
    "pid":"102",
    "size":"S",
    "color":"blue",
    "add":"true"
}
  const HTTP = new XMLHttpRequest();
    const URL = 'http://localhost:8000/orders/cart';
    HTTP.open("POST", URL);
    HTTP.onload = () =>{
    let INFO = HTTP.responseText;
    console.log(INFO)
    }
    HTTP.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const string = JSON.stringify(testObj)
    HTTP.send(string);
}
document.cookie = "test =hello WOrld"
let x= new Date(Date.now() + 900000).toUTCString()
let testObj = {
  "vid":"001",
  "pid":"102",
  "size":"S",
  "color":"blue",
  "add":"true"
}


document.cookie= "username="+JSON.stringify(testObj)+"; expires=" + x;
console.log(x)


