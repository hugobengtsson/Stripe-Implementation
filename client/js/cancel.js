import { checkUserInCookie, logoutUser } from "../helpers/fetchHelper.js";

let myPage = document.getElementById("myPage")
const initSite = async () => {
   
    showCorrectAuthBoxes()
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
        const logOut = await logoutUser()
        alert("Du är utloggad!")
        showCorrectAuthBoxes()
        window.location.href = "./index.html"
        return
    } 
})


window.addEventListener("load", initSite)