const wordList = ["PLAGE", "RIVET", "MONDE", "TARIF", "BOULE"];

//Selectionner un mot aleatoire

const word = wordList[Math.floor(Math.random() * wordList.length)];

let maxTries = 5;
let currentGuess = "";

/**
 * Ecoute de la lettre saisie par l'utilisateur
 */
document.addEventListener("keydown", function (event) {
  const key = event.key; // ajoute les touche appuyer dans un tableau (letter)

  // Si la touche est une lettre (on filtre avec une regex)
  if (/^[a-zA-Z]$/.test(key) && currentGuess.length < word.length) {
    currentGuess += key.toUpperCase(); // On ajoute la lettre en majuscule
    console.log("Lettre ajoutée :", currentGuess);
  }

  // Si la touche est 'Backspace', on enlève la dernière lettre
  if (key === "Backspace") {
    currentGuess = currentGuess.slice(0, -1);
    console.log("Lettre supprimée :", currentGuess);
  }

  // Quand on appuie sur Entrée
  if (key === "Enter") {
    if (currentGuess.length !== word.length) {
      console.log("Mot trop court ou trop long !");
      return;
    }

    if (currentGuess === word) {
      console.log("Bravo ! Vous avez trouvé le mot :", word);
    } else {
      maxTries--;
      console.log(" Mauvais mot. Essais restants :", maxTries);
    }

    // Réinitialiser le mot saisi pour la tentative suivante
    currentGuess = "";

    if (maxTries === 0) {
      console.log("Plus d'essais. Le mot était :", word);
    }
  }
});
