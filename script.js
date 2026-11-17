const prod = document.getElementById("produit");
const articles = document.getElementById("articles");
const nompanier = document.getElementById("panier");

let paniers = JSON.parse(localStorage.getItem("monPanier")) || [];

// 1. Fonction maka ny vokatra avy any amin'ny API sy mampiseho azy
async function chargerProduits() {
    try {
        // Mampiseho hafatra miandry kely mba hahafantaran'ny mpampiasa fa miasa ny pejy
        prod.innerHTML = "<p>Chargement des produits...</p>";

        const valiny = await fetch("https://fakestoreapi.com/products?limit=4");
        const produitsAPI = await valiny.json();

        prod.innerHTML = ""; // Fafana ilay hafatra miandry

        for(let i = 0; i < produitsAPI.length; i++){
            prod.innerHTML += `
            <div class="prod">
                <img src="${produitsAPI[i].image}" alt="${produitsAPI[i].title}" style="width:100px; height:100px; object-fit:contain;">
                <h3>${produitsAPI[i].title}</h3>
                <p>Prix: ${produitsAPI[i].price} $</p>
                <button class="bout">Acheter</button>
            </div>
            `;
        }

        // 2. ZAVA-DEHIBE: Eto anatiny ihany no asiana ny fihainoana ny bokotra "Acheter"
        // satria eto vao vita foronina tao amin'ny HTML ireo bokotra ireo!
        const boutons = document.querySelectorAll(".bout");
        
        for(let i = 0; i < boutons.length; i++){
            boutons[i].addEventListener("click", () => {
                let produitSelectionne = produitsAPI[i];

                // Mariho fa "title" sy "price" no anaran'ny saha ao amin'ny API (fa tsy "nom" sy "prix" intsony)
                let produitExistant = paniers.find(function(p) {
                    return p.nom === produitSelectionne.title;
                });

                if (!produitExistant) {
                    paniers.push({
                        nom: produitSelectionne.title,
                        prix: produitSelectionne.price,
                        quantite: 1
                    });
                } else {
                    produitExistant.quantite++;
                }

                afficherPanier();
            });
        }

    } catch (erreur) {
        prod.innerHTML = "<p>Erreur lors du chargement des produits.</p>";
        console.error(erreur);
    }
}

// 3. Ilay fonction mitantana ny panier (mitovy tamin'ny teo ihany, novaina kely ho $ ny vola)
function afficherPanier() {
    nompanier.innerHTML = "";
    let totalPanier = 0;
    let totalQuantite = 0;

    for(let i = 0; i < paniers.length; i++){
        let totalArticle = paniers[i].quantite * paniers[i].prix;
        totalPanier += totalArticle;
        totalQuantite += paniers[i].quantite;

        let estDisabled = paniers[i].quantite === 1 ? "disabled" : "";

        nompanier.innerHTML += `
        <p>
            - ${paniers[i].nom} | Qté : ${paniers[i].quantite} | ${totalArticle.toFixed(2)} $
            <button class="diminuer" data-index="${i}" ${estDisabled}> - </button>
            <button class="supprimer" data-nom="${paniers[i].nom}">Supprimer</button>
        </p>
        `;
    }

    nompanier.innerHTML += `<hr><strong>Total: ${totalPanier.toFixed(2)} $</strong>`;

    let arts = totalQuantite > 1 ? "Articles" : "Article";
    articles.innerHTML = `
        <p>${totalQuantite} ${arts}</p>
        <p>Total: ${totalPanier.toFixed(2)} $</p>
    `;

    localStorage.setItem("monPanier", JSON.stringify(paniers));

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

    let supprimerBtns = nompanier.querySelectorAll(".supprimer");
    for(let j = 0; j < supprimerBtns.length; j++){
        supprimerBtns[j].addEventListener("click", function() {
            let nomProduit = this.getAttribute("data-nom");
            paniers = paniers.filter(function(p) {
                return p.nom !== nomProduit;
            });
            afficherPanier();
        });
    }
}

// Antsoina avy hatrany izy roa eo am-panombohana
chargerProduits();
afficherPanier();