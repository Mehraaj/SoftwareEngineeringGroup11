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
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  console.log("Password: ");
  console.log(password);
  const url =
        `http://localhost:8000/users?username=${username}&password=${password}`;
  
  console.log("url: ")
  console.log(url)
  HTTP.open("GET", url, false);
  HTTP.withCredentials = true;
  HTTP.onload = () =>{
    if(HTTP.status != 200){
      alert("Error: Invalid Username or Password");
      location.assign('./logInpage.html');
      return;
    }

    console.log("HTTP Response: ")
    console.log(HTTP.status);
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
  document.getElementById("check").href='./homepage.html';
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


