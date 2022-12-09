window.onscroll = function () {
  myFunction();
};

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

let submit = document.getElementById("submitButton");

submit.onclick = async function () {
  await Submit();
};

async function httpRequest(){
  console.log("In httpRequest");
  const HTTP = new XMLHttpRequest();
  let url =
        "http://localhost:8000/checkLogIn?username=" +
        "username" +
        "&password=" +
        "password";
  

  HTTP.open("GET", url, false);
  HTTP.onload = () =>{
    console.log(HTTP.response);
    processRequest(HTTP.response);
  }
  HTTP.send();
  
  }
 /* axios
  .get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    resolve(response.data);
  });
} catch (error) {
reject(error);
}
}); */

async function Submit() {
console.log("in submit");
  httpRequest();
 /* if (resp.APIKey !== null) {
    let check = document.getElementById("check");
    check.href = "./AccountPage.html";
  }
  return; */
}

function processRequest(data){
  console.log("in ProcessRequest");
  console.log(data);
  document.getElementById("check").href='./homepage.html'
}

function CreateUser() {
  let user = {
    Username: "",
    Password: "",
    Cart: "",
    CCNum: "",
    CVV: "",
    Exp: "",
    address: "",
  };
  return user;
}
