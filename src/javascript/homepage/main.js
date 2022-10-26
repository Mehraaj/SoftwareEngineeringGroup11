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

