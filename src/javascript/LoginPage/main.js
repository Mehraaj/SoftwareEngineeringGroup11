
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

let submit = document.getElementById("submitButton")

submit.onclick =function() {Submit()};
let USER = CreateUser();
function Submit(){
  let x = document.getElementsByClassName("Inputs");
  USER.Username = x[0].value;
  USER.Password = x[1].value;
  if(USER.Username != "" && USER.Password != ""){
    
    let check =document.getElementById("check");
    check.href = "./AccountPage.html";
    
  }
  
}

function CreateUser(){
    let user = {
    Username:"",
    Password:"",
    Cart:"",
    CCNum:"",
    CVV:"",
    Exp:"",
    address:""
  }
  return user
}
