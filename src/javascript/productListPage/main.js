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
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const category = urlParams.get('Category');
console.log(category);
var filter = urlParams.get('filter');
console.log(filter);
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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

async function start(){ // function that parses db for info first
  const HTTP = new XMLHttpRequest();
  if (filter === "all"){
    filter = '';
  }
  const URL = 'http://localhost:8000/productCatalog?category=' + category + '&gender=' + filter;
  console.log(URL);
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log("response");
    console.log(HTTP.response);
    afterstart(HTTP.response);
  }
  HTTP.send();
}

function afterstart(DATA){
  console.log("in afterstart");
  let count = 0;
  let first = true;
  let second = true; 
  var ALLITEMSOBJ = JSON.parse(DATA).data;
  let smallContainer = document.getElementById('main').children; //row + 1
  //let innerproductcard = productcard[0].children;
  console.log(smallContainer.length)

  for(let j = 1; j <smallContainer.length; j++){
    console.log("In first for loop");
    for(let i = 0; i<4;i++){
      if (count < ALLITEMSOBJ.length){
      let productcard = smallContainer[j].children[0].children;      //col
      let innerProductCard = productcard[i].children; // view the featured product and get the elems of that 
      let aTag = innerProductCard[0].children;// elems i
      let productList = aTag[0].children;
      let name = productList[1].children;
      let price = productList[2].children;
      let image = productList[0].children;
      console.log(i + (j-1)*(productcard.length))
      name[0].innerHTML = ALLITEMSOBJ[i + (j-1)*(productcard.length)].Name
      price[0].innerHTML = ALLITEMSOBJ[i + (j-1)*(productcard.length)].Price
      image[0].src = ALLITEMSOBJ[i + (j-1)*(productcard.length)].image
      count++;
      }
      else{
        if (first)
        {
        filledInRow = count % 4; 
        if (filledInRow === 0) {
          removeAllChildNodes(smallContainer[j])
        }
        else if (filledInRow === 1){
          let productcard = smallContainer[j].children[0].children;
          removeAllChildNodes(productcard[1]); 
          removeAllChildNodes(productcard[2]);
          removeAllChildNodes(productcard[3]);     
        }
        else if (filledInRow === 2){
          let productcard = smallContainer[j].children[0].children; 
          removeAllChildNodes(productcard[2]);
          removeAllChildNodes(productcard[3]);     
        }
        else if (filledInRow === 3){
          let productcard = smallContainer[j].children[0].children; 
          removeAllChildNodes(productcard[3]);     
        }
       first = false;
       break;
      }
      else{
        if (first === false)
          removeAllChildNodes(smallContainer[j])
      }
    
      }
    }
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
