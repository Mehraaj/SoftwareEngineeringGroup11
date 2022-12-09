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