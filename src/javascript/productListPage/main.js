window.onscroll = function() {myFunction()};
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

async function start(){ // function that parses db for info first
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/productCatalog';
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log(HTTP.response);
    
    afterstart(HTTP.response);
  }
  HTTP.send();
}
function afterstart(DATA){
  var ALLITEMSOBJ = JSON.parse(DATA).data;
  let numofrows = document.getElementById('main').children;
  for(let j = 1; j<numofrows.length; j++){
    

  }
  /*var featuredItems = document.getElementById('featuredItems').children;
  for(let i = 0 ; i<featuredItems.length;i++){
    let innerProductCard = featuredItems[i].children; // view the featured product and get the elems of that 
    let aTagLitag = innerProductCard[0].children;// elems i
    let insideatag = aTagLitag[0].children;
    let name = insideatag[1].children;
    let price = insideatag[2].children;
    name[0].innerHTML =ALLITEMSOBJ[i].Name
    price[0].innerHTML = ALLITEMSOBJ[i].Price
    
  }*/
}
start();
