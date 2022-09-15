
const validateValues = (object) => {
    if(
        object.name.length == 0 ||  
        object.email.length == 0 ||  
        object.address.line1.length == 0 ||  
        object.address.postal_code.length == 0 || 
        object.address.city.length == 0 || 
        object.address.country.length == 0 || 
        object.phone.length == 0
    ) {
        return {bool: false, msg: "Fel!" }
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(object.email)) {
        return {bool: false, msg: "Fel!" }
    }
    if(object.address.country == "Sverige" && object.address.postal_code.length != 5 || /^[0-9]+$/.test(object.address.postal_code) == false) {
        return {bool: false, msg: "Fel!"}
    }
    if(object.address.country == "Norge" && object.address.postal_code.length != 4 || /^[0-9]+$/.test(object.address.postal_code) == false) {
        return {bool: false, msg: "Fel!"}
    }
    if(object.phone.length != 10 || /^[0-9]+$/.test(object.phone) == false) {
        return {bool: false, msg: "Fel!"}
    }
    if(object.name.length < 3 ) {
        return {bool: false, msg: "Fel!"}
    } 
    if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(object.name) == false){
        return {bool: false, msg: "Fel!"}
    }
    if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(object.address.city) == false){
        return {bool: false, msg: "Fel!"}
    }
    if(object.address.city.length < 3) {
        return {bool: false, msg: "Fel!"}
    }
    return {bool: true, msg: "Pass!"}
}

export default validateValues
