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
myPage.addEventListener("click", async () => {
    const checkuser = await checkUserInCookie();

    if(checkuser.msg.user) {
        await logoutUser()
        alert("Du är utloggad!")
        return
    } 
})


window.addEventListener("load", initSite)