const produit = [
    {
        nom: "Ordinateur",
        prix: 700000
    },
    {
        nom: "Telephone",
        prix: 400000
    },
    {
        nom: "Frigidaire",
        prix: 200000
    }
];

const prod = document.getElementById("produit");
const articles = document.getElementById("articles");
const nompanier = document.getElementById("panier");

// Alaina ny ao amin'ny localStorage
let paniers = JSON.parse(localStorage.getItem("monPanier")) || [];

// Asehoy ny vokatra eny am-piandohana
for(let i = 0; i < produit.length; i++){
    prod.innerHTML += `
    <div class="prod">
        <h3>${produit[i].nom}</h3>
        <p>Prix: ${produit[i].prix} Ar</p>
        <button class="bout">Acheter</button>
    </div>
    `;
}

const boutons = document.querySelectorAll(".bout");

// Fonction mitantana ny fisehon'ny panier
function afficherPanier() {
    nompanier.innerHTML = "";
    let totalPanier = 0;
    let totalQuantite = 0;

    for(let i = 0; i < paniers.length; i++){
        let totalArticle = paniers[i].quantite * paniers[i].prix;
        totalPanier += totalArticle;
        totalQuantite += paniers[i].quantite;

        // Raha 1 ny quantité dia atao disabled ilay bokotra -
        let estDisabled = paniers[i].quantite === 1 ? "disabled" : "";

        nompanier.innerHTML += `
        <p>
            - ${paniers[i].nom} | Quantité : ${paniers[i].quantite} | ${totalArticle} Ar
            <button class="diminuer" data-index="${i}" ${estDisabled}> Diminuer </button>
            <button class="supprimer" data-nom="${paniers[i].nom}">Supprimer</button>
        </p>
        `;
    }

    nompanier.innerHTML += `<hr><strong>Total: ${totalPanier} Ar</strong>`;

    let arts = totalQuantite > 1 ? "Articles" : "Article";
    articles.innerHTML = `
        <p>${totalQuantite} ${arts}</p>
        <p>Total: ${totalPanier} Ar</p>
    `;

    // Tahirizina ao amin'ny localStorage
    localStorage.setItem("monPanier", JSON.stringify(paniers));

    // 1. Fikarakarana ny bokotra Diminuer (-)
    let diminuerBtns = nompanier.querySelectorAll(".diminuer");
    for(let k = 0; k < diminuerBtns.length; k++){
        diminuerBtns[k].addEventListener("click", function() {
            let index = this.getAttribute("data-index");
            if(paniers[index].quantite > 1) {
                paniers[index].quantite--;
            }
            afficherPanier();
        });
    }

    // 2. Fikarakarana ny bokotra Supprimer amin'ny alalan'ny FILTER()
    let supprimerBtns = nompanier.querySelectorAll(".supprimer");
    for(let j = 0; j < supprimerBtns.length; j++){
        supprimerBtns[j].addEventListener("click", function() {
            let nomProduit = this.getAttribute("data-nom");
            
            // Ampiasaina ny filter() hamoronana tabilao vaovao tsy misy an'io entana io
            paniers = paniers.filter(function(p) {
                return p.nom !== nomProduit;
            });
            
            afficherPanier(); // Havaozina ny pejy sy ny localStorage
        });
    }
}

// Antsoina rehefa misokatra ny pejy
afficherPanier();

// Rehefa tsindrina ny "Acheter"
for(let i = 0; i < boutons.length; i++){
    boutons[i].addEventListener("click", () => {
        let produitSelectionne = produit[i];

        let produitExistant = paniers.find(function(p) {
            return p.nom === produitSelectionne.nom;
        });

        if (!produitExistant) {
            paniers.push({
                nom: produitSelectionne.nom,
                prix: produitSelectionne.prix,
                quantite: 1
            });
        } else {
            produitExistant.quantite++;
        }

        afficherPanier();
    });
}