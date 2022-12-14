import { checkUserInCookie, logoutUser, makeRequest} from "../helpers/fetchHelper.js";
import { renderOrders } from "./renderOrders.js";

export const stripe = Stripe("pk_test_51Lh7v3LiXPjWjAyxeBK9PUswZwXrKZ5PiajD2a7NRxeAl6bKWg6udbItz9uRYfeodsCkWLdZQrIQQEsz45s8pIby004x2bX371");

var isItemsViewVisible = false;
let myPage = document.getElementById("myPage")

const initSite = async () => {
    createUIFromLoadedItemsData();
    showCorrectAuthBoxes();
    setCounter()
}

// What will be shown if you're logged in or not
async function showCorrectAuthBoxes() {
    const checkuser = await checkUserInCookie();

    if(checkuser.bool) {
        myPage.innerText = "Logga ut"
        return
    } 
        myPage.innerText = "Logga in"
}

async function getProducts() {
    try {
        const products = await fetch("http://localhost:3000/api/getAllProducts");
        const result = await products.json()
        return result;
    } catch(err) {
        console.error(err)
    }
}

/* Use the data to create a list of these object on your website */
async function createUIFromLoadedItemsData() {

    if (isItemsViewVisible) { return; }
    isItemsViewVisible = true;

    const products = await getProducts()
    
    /* Create a list of the products */
    var list = document.createElement("ul");
    for(var index = 0; index < products.length; index++) {
        list.appendChild(createListItem(products[index]));
    }

    /* Add the list to the DOM */
    var container = document.querySelector("#main");
    if (container.firstChild) {
        container.replaceChild(list, container.firstChild);
    } else {
        container.appendChild(list);
    }
}

function createListItem(itemData) {
    /* Title */
    var title = document.createElement("h3");
    title.innerText = itemData.name;
    
    /* Description */
    var description = document.createElement("p");
    description.innerText = itemData.description;
    
    /* Image */
    var image = document.createElement("img");
    image.src = itemData.images[0];

    /* Price */
    var price = document.createElement("span");
    price.innerText = itemData.default_price.unit_amount_decimal.substring(0, itemData.default_price.unit_amount_decimal.length - 2) + " kr";
    
    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-cart-arrow-down" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "L??gg till i kundvagnen";
    button.onclick = function() {

        if (localStorage.getItem("cart")) {
            let cart = JSON.parse(localStorage.getItem("cart"));
            let foundIndex = cart.findIndex(cartItem => cartItem.id === itemData.id)
            if(foundIndex >= 0) {
                cart[foundIndex].quantity ++
            } else {
                let newCartItem = itemData;
                newCartItem.quantity = 1;
                cart.push(newCartItem)
            }
            localStorage.setItem("cart", JSON.stringify(cart))
        } else {
            let newCartItem = itemData;
            newCartItem.quantity = 1;
            localStorage.setItem("cart", JSON.stringify([newCartItem]))
        }
        setCounter()
    };

    var item = document.createElement("li");
    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(image);
    item.appendChild(price);
    item.appendChild(button);

    return item;
}


async function showShoppingCart() {
    if (!isItemsViewVisible) { return; }
    isItemsViewVisible = false;

    /* Header */
    var header = document.createElement("h2");
    header.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i>' + " Kundvagn";
    
    /* Shopping list */
    var list = document.createElement("ul");
    
    let shoppingCart = JSON.parse(localStorage.getItem("cart"));

    if(!shoppingCart){
        shoppingCart = []
    }

    for(var index = 0; index < shoppingCart.length; index++) {
        list.appendChild(createShoppingCartItem(shoppingCart[index], index));
    }
    
    /* Shopping info & action */
    var info = await createShoppingSummary();

    // Render previous order:
    let orders = await renderOrders();
    
    var content = document.createElement("div");
    content.appendChild(header);
    content.appendChild(list);
    content.appendChild(info);
    content.appendChild(orders);

    var container = document.querySelector("#main");

    const checkuser = await checkUserInCookie();

    if(!checkuser.bool) {
        alert("Logga in f??rst")
        window.location.href = "./myPage.html"
        return
    }
    container.replaceChild(content, container.firstChild);
}

function createShoppingCartItem(itemData, index) {
    /* Image */
    var image = document.createElement("img");
    image.src = itemData.images[0];

    /* Title */
    var title = document.createElement("h3");
    title.innerText = itemData.name;

    /* Price */
    var price = document.createElement("span");
    price.innerText = itemData.default_price.unit_amount_decimal.substring(0, itemData.default_price.unit_amount_decimal.length - 2) + " kr";

    var quantity = document.createElement("span");
    quantity.innerText = "Antal: " + itemData.quantity;

    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Ta bort";
    button.onclick = function() {

        let shoppingCart = JSON.parse(localStorage.getItem("cart"));
        /* Remove the item from the array */
        shoppingCart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(shoppingCart))

        // Update counter
        setCounter()
        /* Update the UI list */
        isItemsViewVisible = true;
        showShoppingCart();
    };

    var item = document.createElement("li");
    item.appendChild(image);
    item.appendChild(title);
    item.appendChild(price);
    item.appendChild(quantity);
    item.appendChild(button);

    return item;
}

async function createShoppingSummary() {

    var info = document.createElement("div");

    /* Total price */
    let shoppingCart = JSON.parse(localStorage.getItem("cart"));
    var totalPrice = 0;

    if(!shoppingCart){
        shoppingCart = []
    }
    for(var i = 0; i < shoppingCart.length; i++) {
        totalPrice += Number(shoppingCart[i].default_price.unit_amount_decimal.substring(0, shoppingCart[i].default_price.unit_amount_decimal.length - 2) * shoppingCart[i].quantity);
    }
    var priceLabel = document.createElement("h2");
    priceLabel.innerText = "Totalt pris: " + totalPrice + " kr";

    if(shoppingCart.length > 0) {

        /* Proceed button */
        var proceedButton = document.createElement("button");
        proceedButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Slutf??r ditt k??p";
        proceedButton.onclick = async function() {
            // alert("Tack f??r din best??llning, vi ??nskar dig en fin kv??ll! Ses snart igen =)");
            let body = JSON.stringify(shoppingCart)
            
            let response = await makeRequest(
                "/api/payment/create-payment",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body
                }
                )
                if(response){
                    const result = await stripe.redirectToCheckout({
                        sessionId: response,
                    });
                    
                }else{
                    alert("Logga in f??rst")
                    window.location.href = "./myPage.html"
                }
            };
        info.appendChild(proceedButton);
    }

    info.prepend(priceLabel);

    return info;
}

// Set cart counter
function setCounter() {

    /* Update the counter */
    let counter = document.querySelector("#counter");
    let cart = JSON.parse(localStorage.getItem("cart"));
    let totalQuantity = 0

    if(cart) {
        for( let i=0; i < cart.length; i++ ) {
            totalQuantity = totalQuantity + cart[i].quantity
        }
    }
    counter.innerText = totalQuantity;
}

// What will happen when you click on the logOut-link
myPage.addEventListener("click", async () => {
    const checkuser = await checkUserInCookie();

    if(checkuser.bool) {
        const logOut = await logoutUser()
        alert("Du ??r utloggad!")
        showCorrectAuthBoxes()
        window.location.href = "./index.html"
        return
    } 
    window.location.href = "./myPage.html"
})



document.getElementById("home").addEventListener("click", createUIFromLoadedItemsData)
document.getElementById("cart").addEventListener("click", showShoppingCart)
window.addEventListener("load", initSite)