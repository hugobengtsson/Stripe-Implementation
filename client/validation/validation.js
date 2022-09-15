
const validateValues = (object, password) => {

    if(
        object.name.length == 0 ||  
        password.length == 0 || 
        object.email.length == 0 ||  
        object.address.line1.length == 0 ||  
        object.address.postal_code.length == 0 || 
        object.address.city.length == 0 || 
        object.address.country.length == 0 || 
        object.phone.length == 0
    ) {
        return {bool: false, msg: "Fyll i alla fält!" }
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(object.email)) {
        return {bool: false, msg: "Email - Fel format" }
    }
    if(object.address.country == "Sverige" && object.address.postal_code.length != 5 || /^[0-9]+$/.test(object.address.postal_code) == false) {
        return {bool: false, msg: "Postkod - Måste innehålla 5 siffror"}
    }
    if(object.address.country == "Norge" && object.address.postal_code.length != 4 || /^[0-9]+$/.test(object.address.postal_code) == false) {
        return {bool: false, msg: "Postkod - Måste innehålla 4 siffror"}
    }
    if(object.phone.length != 10 || /^[0-9]+$/.test(object.phone) == false) {
        return {bool: false, msg: "Telefonnummer -  Måste innehålla 10 siffror. Ex. 0721112233"}
    }
    if(object.phone.startsWith("0") == false) {
        return {bool: false, msg: "Telefonnummer -  Måste börja med 0. Ex. 0721112233"}
    }
    if(password.length < 6) {
        return {bool: false, msg: "Lösenord - Måste innehålla minst 6 karaktärer"}
    }
    if(object.name.length < 3 ) {
        return {bool: false, msg: "Namn - Måste innehålla minst 2 bokstäver"}
    } 
    if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(object.name) == false){
        return {bool: false, msg: "Namn - Får endast innehålla bokstäver"}
    }
    if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(object.address.city) == false){
        return {bool: false, msg: "Ort - Får endast innehålla bokstäver"}
    }
    if(object.address.city.length < 3) {
        return {bool: false, msg: "Ort - Måste innehålla minst 2 bokstäver"}
    }
    if(object.address.line1.length < 5) {
        return {bool: false, msg: "Address - Måste innehålla minst 4 karaktärer"}
    }

    return {bool: true, msg: "Pass!"}
}

export default validateValues
