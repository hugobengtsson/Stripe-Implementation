# Stripe-Implementation

This is a group assignment made by Hugo Bengtsson, Fredrik Lexö and Angelica Moberg Skoglund. The assignment was to integrate a pre-built webshop to Stripe.

## Structure: 
Frontend: Vanilla JavaScript, HTML & CSS

Backend: Node.js


## Requirements for the assignment

Below follows the assignments different requirements in Swedish.

### Krav för godkänt: 
1. Uppgiften ska lämnas in i tid. ✅ 
2. Produkter ska listas på en sida. ✅ 
3. Det ska gå att lägga till produkter i en kundvagn. ✅ 
4. Baserad på kundvagnen ska det gå att lägga en order genom Stripe. ✅ 
5. En ”Customer" skall skapas i Stripe i samband med att en ny order placeras (detta
kräver ett formulär för att ange informationen Stripe efterfrågar). Validering på detta
formulär/inputfält skall finnas. ❌
6. Samtliga placerade ordrar skall sparas till en lista i en JSON-fil. ✅
7. Ordern får inte under några omständigheter läggas utan genomförd betalning! (dvs.
Spara aldrig ett orderobjekt såvida ni inte fått bekräftelse tillbaka ifrån stripe att betalningen gått igenom) ✅

### Krav för väl godkänt: 
1. Alla punkter för godkänt är uppfyllda ✅ 
2. Man skall kunna registrera sig som en användare i webbshoppen. Detta skall resultera
i att en ”Customer” skapas i Stripe (samtliga lösenord skall sparas hashade). ✅ 
3. Man skall kunna logga in som kund. Den inloggade kunden (som även är sparad i
Stripe) skall användas vid placering av order. ✅ 
4. Man skall som inloggad kunna se sina lagda ordrar. ✅ 
5. Man skall inte kunna placera en order om man inte är inloggad. ✅ 
6. Produkter som visas och köps skall hämtas ifrån Stripe. ✅ 

Link to repo: https://github.com/hugobengtsson/Stripe-Implementation

## Installing

* Open project in your code editor

* Open terminal. Make sure you are standing in the folder.
    -	Npm i
    -	Npm start



