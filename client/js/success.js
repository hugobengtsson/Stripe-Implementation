import { checkUserInCookie, logoutUser, makeRequest } from "../helpers/fetchHelper.js";

let myPage = document.getElementById("myPage")

const initSite = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id')
    
    if(sessionId){
        await verifyPayment(sessionId)
    }else{
        window.location.href = "/" 
    }
    showCorrectAuthBoxes()
}

async function verifyPayment(sessionId){
    const body = JSON.stringify({sessionId})

    let response = await makeRequest(
        "/api/payment/verify-payment",
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }
    )

    const message = document.getElementById("message")

    if(response.customer_details){
        var emptyArray = [];
        localStorage.setItem("cart", JSON.stringify(emptyArray));
    
        //localStorage.removeItem("cart")
        message.innerText = `Tack ${response.customer_details.name} för din beställning! Ditt ordernummer: ${response.id}`
        
    }else{
        window.location.href = "/" 
    }
}

async function showCorrectAuthBoxes() {
    const checkuser = await checkUserInCookie();

    if(checkuser.msg.user) {
        myPage.innerText = "Logga ut"
        myPage.href = "./index.html"
        return
    } 
    window.location.href = "/" 
}

// What will happen when you click on the logOut-link
myPage.addEventListener("click", async (e) => {
    e.preventDefault()
    const checkuser = await checkUserInCookie();

    if(checkuser.bool) {
        await logoutUser()
        alert("Du är utloggad!")
        showCorrectAuthBoxes()
        window.location.href = "./index.html"
        return
    } 
})

window.addEventListener("load", initSite)