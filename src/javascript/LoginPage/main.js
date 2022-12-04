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


async function Submit(){
  console.log("In Submit function");
  let x = document.getElementsByClassName("Inputs");
  try{
  let url = "http://localhost:3000/checkLogIn?username=" + x[0].value + "&password=" + x[1].value;
  let response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'withCredentials' : true
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
}
  catch(error){
    console.log("In Catch");
    console.log(error);
  }
  
  console.log("After fetch");
  res = response.json();
  console.log(res);        //Lets assume that res has the API Key and the API Date 
  
  if (res.APIKey !== null){
    
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
