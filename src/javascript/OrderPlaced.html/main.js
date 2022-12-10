const params = (new URL(document.location)).searchParams;
document.getElementById("order-number").innerHTML = "#" + params.get("ordernumber");


document.getElementById("download-receipt").onclick = function() {
    window.location.href = "http://localhost:8000/orders/receipts/" + params.get("ordernumber");
}