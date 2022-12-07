
// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};
//console.log(fetch('http://localhost:8000/productCatalog'))
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


async function start(){ // function that parses db for info first
  const HTTP = new XMLHttpRequest();
  const URL = 'http://localhost:8000/productCatalog';
  HTTP.open("GET", URL);
  HTTP.onload = () =>{
    console.log("response: ");
    console.log(HTTP.response);
    
    afterstart(HTTP.response);
  }
  HTTP.send();
}


function afterstart(DATA){
  var ALLITEMSOBJ = JSON.parse(DATA).data;
  var featuredItems = document.getElementById('featuredItems').children;
  console.log(ALLITEMSOBJ)
  let len = Math.min(ALLITEMSOBJ.length,featuredItems.length)
  for(let i = 0 ; i<len;i++){
    let innerProductCard = featuredItems[i].children; // view the featured product and get the elems of that 
    let aTagLitag = innerProductCard[0].children;// elems i
    let insideatag = aTagLitag[0].children;
    let name = insideatag[1].children;
    let price = insideatag[2].children;
    let image = insideatag[0].children;
    let PID = insideatag[3];
    name[0].innerHTML =ALLITEMSOBJ[i].Name
    price[0].innerHTML = ALLITEMSOBJ[i].Price
    image[0].src = ALLITEMSOBJ[i].image;
    PID.value = ALLITEMSOBJ[i].PID
  
  }
  var shoes = ALLITEMSOBJ.filter(item => item.Category === 'shoes')
  console.log("Shoes");
  console.log(shoes);
  var shoeItems = document.getElementById('shoes').children;
  let length = Math.min(shoeItems.length,shoes.length)
  
  for(let i =0; i<length;i++){
    let innerProductCard = shoeItems[i].children; // view the featured product and get the elems of that 
    let aTagLitag = innerProductCard[0].children;// elems i
    let insideatag = aTagLitag[0].children;
    let name = insideatag[1].children;
    let price = insideatag[2].children;
    let image = insideatag[0].children;
    let PID = insideatag[3];
    name[0].innerHTML =shoes[i].Name
    price[0].innerHTML = shoes[i].Price
    image[0].src = shoes[i].image;
    PID.value = ALLITEMSOBJ[i].PID
  }

  var shirts = ALLITEMSOBJ.filter(item => item.Category === 'shirts')
  var shirtItems = document.getElementById('Shirts').children;
   length = Math.min(shirtItems.length,shirts.length)
   console.log("Shirts");
   console.log(shirts);
  for(let i =0; i<length;i++){
    let innerProductCard = shirtItems[i].children; // view the featured product and get the elems of that 
    let aTagLitag = innerProductCard[0].children;// elems i
    let insideatag = aTagLitag[0].children;
    let name = insideatag[1].children;
    let price = insideatag[2].children;
    let image = insideatag[0].children;
    let PID = insideatag[3];
    name[0].innerHTML =shirts[i].Name
    price[0].innerHTML = shirts[i].Price
    image[0].src = shirts[i].image
    PID.value = ALLITEMSOBJ[i].PID
  }
  var pants = ALLITEMSOBJ.filter(item => item.Category === 'pants')
  console.log("pants");
   console.log(pants);
  console.log(pants[0].Price)
 
  var pantItems = document.getElementById('pants').children;
   length = Math.min(pantItems.length,pantItems.length)
  
  for(let i =0; i<length;i++){
    let innerProductCard = pantItems[i].children; // view the featured product and get the elems of that 
    let aTagLitag = innerProductCard[0].children;// elems i
    let insideatag = aTagLitag[0].children;
    let name = insideatag[1].children;
    let price = insideatag[2].children;
    let image = insideatag[0].children;
    let PID = insideatag[3];
    name[0].innerHTML =pants[i].Name;
    price[0].innerHTML = pants[i].Price;
    image[0].src = pants[i].image;
    PID.value = ALLITEMSOBJ[i].PID
  }
  
  let anchors = document.getElementsByClassName("clickToViewPage");


      for(let i = 0; i < anchors.length; i++) {
        let anchor = anchors[i];
        anchor.onclick = function() {
          
          
          
          let prodname = anchor.children[1].children[0].innerHTML
          let prodprice = anchor.children[2].children[0].innerHTML
          let PID = anchor.children[3].value

          
          const productOBJ = {
              name: prodname,
              price: prodprice,
              ProductID:PID,
              
          }
          
          window.sessionStorage.setItem('productOBJ', JSON.stringify(productOBJ))
          ;
        }
    }

}


await start();
