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
    console.log(response);
    if(response){
        localStorage.removeItem("cart")
        message.innerText = `Tack ${response.customer_details.name} för din beställning! Ditt ordernummer: ${response.id}`
        
    }else{
        message.innerText = 'Din betalning misslyckades!'
    }
}

window.addEventListener("load", initSite)