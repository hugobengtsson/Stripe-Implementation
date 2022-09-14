import { makeRequest } from "../helpers/fetchHelper.js";


const initSite = async () => {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id')
 
    if(sessionId){
        await verifyPayment(sessionId)
    }else{
        window.location.href = "/" 
    }
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
    if(response){
        localStorage.removeItem("cart")
        message.innerText = 'Tack för din order!'
        
    }else{
        message.innerText = 'Din betalning misslyckades!'
    }
}

window.addEventListener("load", initSite)