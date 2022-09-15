import { makeRequest, checkUserInCookie } from "../helpers/fetchHelper.js"


export const renderOrders = async () => {

    const checkuser = await checkUserInCookie();

    if(!checkuser.msg.user) {
        return document.createElement("div")
    }

    let orders = await makeRequest("http://localhost:3000/api/getOrders");
    
    if(!orders) {
        return document.createElement("div")
    }
    let container = document.createElement("div");
    container.className = "renderedOrderContainer"

    let headLine = document.createElement("h2");
    headLine.innerText = "Dina tidigare order:"

    
    orders.forEach((order) => {

        let orderContainer = document.createElement("div");
        orderContainer.className = "orderContainer"

        let orderNr = document.createElement("p");
        orderNr.innerText = order.session.id;

        let totalPrice = 0;
        order.lineItems.forEach((lineItem) => {

            let productContainer = document.createElement("div");
            productContainer.className = "productContainer"

            let productName = document.createElement("p");
            productName.innerText = lineItem.description;

            let quantityPriceContainer = document.createElement("div")
            quantityPriceContainer.className = "quantityPriceContainer";

            let quantity = document.createElement("p");
            quantity.innerText = "Antal: " + lineItem.quantity

            let productPrice = document.createElement("p");
            productPrice.innerText = lineItem.price.unit_amount_decimal.substring(0, lineItem.price.unit_amount_decimal.length - 2) + " kr";

            totalPrice = totalPrice + Number(lineItem.price.unit_amount_decimal.substring(0, lineItem.price.unit_amount_decimal.length - 2)) * lineItem.quantity;

            quantityPriceContainer.append(quantity, productPrice)
            productContainer.append(productName, quantityPriceContainer)
            orderContainer.append(productContainer)

        })

        let totalPriceP = document.createElement("p");
        totalPriceP.innerHTML = "Totalt: " + totalPrice + " kr"

        orderContainer.prepend(orderNr)
        orderContainer.append(totalPriceP)
        container.append(orderContainer)

    })

    container.prepend(headLine)

    return container

}