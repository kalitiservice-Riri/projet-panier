const prod = document.getElementById("produit");

async function chargerProduits() {
    try {
        // 1. Alaina avy any amin'ny API ny entana
        const valiny = await fetch("https://fakestoreapi.com/products?limit=4");
        const produitsAPI = await valiny.json();

        // 2. Fafana aloha ilay banga dia averina ampidirina amin'ny alalan'ny boucle
        prod.innerHTML = "";

        for(let i = 0; i < produitsAPI.length; i++){
            prod.innerHTML += `
            <div class="prod">
                <h3>${produitsAPI[i].title}</h3>
                <p>Prix: ${produitsAPI[i].price} $</p>
                <button class="bout">Acheter</button>
            </div>
            `;
        }
    } catch (erreur) {
        console.log("Nisy olana tamin'ny fakana ny entana:", erreur);
    }
}

// Antsoina ilay fonction
chargerProduits();