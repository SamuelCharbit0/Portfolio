// JEU DE SHI-FU-MI

// 1 - L'idée est de permettre au joueur de choisir entre pierre feuille ou ciseaux 
//     dans un premier temps
// 2 - Suite à ce choix l'ordinateur fera également un choix random 
// 3 - Vous comparerez ensuite les 2 choix 
// 4 - Si vous gagnez c'est un point de plus au niveau des scores 
//     Sinon 0 points...
// 5 - Faire en sorte qu'une manche ne dure que 10 tours.

// Recup les éléments HTML dans un premier temps (querySelector etc)
// Ecouter le bouton de jeu + les boutons pour pierre feuille et ciseaux
// Lorsque l'on clique sur le bouton de jeu on recup le choix du joueur (via event target ou autre méthode)
// On vient s'occuper du choix de l'ordi : ce sera un choix aléatoire parmi pierre feuille et ciseaux
// On va comparer les  choix (joueur et ordi) et donner un point au joueur si il a gagné
// On viendra enfin afficher les éléments dans notre HTML

let playerChoice = "";
        let score = 0;
        let round = 1;
        const choices = ["pierre", "feuille", "ciseaux"];

        document.querySelectorAll(".choices img").forEach(img => {
            img.addEventListener("click", (e) => {
                document.querySelectorAll(".choices img").forEach(img => img.classList.remove("selected"));
                e.target.classList.add("selected");
                playerChoice = e.target.dataset.choice;
            });
        });

        document.querySelector(".play").addEventListener("click", () => {
            if (!playerChoice) {
                alert("Veuillez choisir une option !");
                return;
            }
            let computerChoice = choices[Math.floor(Math.random() * choices.length)];
            document.getElementById("player-choice").innerText = playerChoice;
            document.getElementById("computer-choice").innerText = computerChoice;

            if ((playerChoice === "pierre" && computerChoice === "ciseaux") ||
                (playerChoice === "feuille" && computerChoice === "pierre") ||
                (playerChoice === "ciseaux" && computerChoice === "feuille")) {
                score++;
                document.getElementById("result-text").innerText = "Vous avez gagné !";
            } else if (playerChoice === computerChoice) {
                document.getElementById("result-text").innerText = "Égalité !";
            } else {
                document.getElementById("result-text").innerText = "Vous avez perdu !";
            }

            document.getElementById("score").innerText = score;
            document.getElementById("round").innerText = round;
            
            if (round === 10) {
                setTimeout(() => {
                    alert("Fin du jeu ! Votre score est : " + score);
                    score = 0;
                    round = 1;
                    document.getElementById("score").innerText = score;
                    document.getElementById("round").innerText = round;
                    document.querySelectorAll(".choices img").forEach(img => img.classList.remove("selected"));
                }, 500);
            } else {
                round++;
            }
        });