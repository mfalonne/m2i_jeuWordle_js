/*****************Avec un tableau statique***********************/
//1. Stocker une **liste de mots** dans un tableau.
// const wordList = ["PLAGE", "RIVET", "MONDE", "TARIF", "BOULE"];

//2. Sélectionner **un mot aléatoirement** dans ce tableau.
// const word = wordList[Math.floor(Math.random() * wordList.length)];
// console.log(word);
/********************************************************************************* */
const BASE_URL = `https://www.themealdb.com/api/json/v1/1/random.php`;
let word = "";
//3. Initialiser le **nombre d’essais à 5**.
let maxTries = 5; //nombre d'esaie autoriser

let currentGuess = ""; //stocke le mot que l'utilisateur est entrain d'ecrire
let currentTry = 0; //stocke le nombre d'essaie. on commence à 0

//Recuperation des données
const getData = async () => {
  const response = await fetch(`${BASE_URL}`);
  const data = await response.json();
  const meal = data.meals[0];

  word = meal.strArea.toUpperCase();
  console.log(word);

  const plat = {
    name: meal.strMeal,
    image: meal.strMealThumb,
    origine: meal.strArea,
  };
  displayPlat(plat);
  initBoard();
};

//Afficher les données

const displayPlat = (plat) => {
  const divGuess = document.getElementById("guessOriginOfPlat");
  const divName = document.createElement("div");
  divName.textContent = plat.name;
  divName.style.fontSize = "20px";
  divName.style.fontWeight = "bold";

  const img = document.createElement("img");
  img.src = plat.image;
  img.alt = plat.name;
  img.style.maxWidth = "200px";

  divGuess.appendChild(divName);
  divGuess.appendChild(img);
};

//Initialisation des données à l'arriver de la page

const initBoard = () => {
  const board = document.getElementById("board");
  board.innerHTML = ""; // on vide au cas où

  for (let i = 0; i < maxTries; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.setAttribute("data-line", i);

    for (let j = 0; j < word.length; j++) {
      const span = document.createElement("span");
      span.classList.add("case");
      line.appendChild(span);
    }

    board.appendChild(line);
  }
};

//4. Récupérer les **appuis de touches** de l’utilisateur avec `addEventListener("keydown")`.
document.addEventListener("keydown", function (event) {
  const key = event.key; // on récupère la touche saisie

  // Si la touche est une lettre (on filtre avec une regex)
  if (/^[a-zA-Z]$/.test(key)) {
    addLetter(key);
  }

  if (key === "Backspace") {
    handleBackspace(key);
  }

  keyEnter(key);

  //Relier le clasier physique au clavier virtuel
  const keyPressed = key.toUpperCase();
  const virtualKeys = document.querySelectorAll(".key");

  virtualKeys.forEach((btn) => {
    if (
      btn.textContent === keyPressed ||
      (keyPressed === "BACKSPACE" && btn.textContent === "←") ||
      (keyPressed === "ENTER" && btn.textContent === "ENTER")
    ) {
      btn.classList.add("active");

      setTimeout(() => {
        btn.classList.remove("active");
      }, 100);
    }
  });
});

//Ajouter la lettre
const addLetter = (letter) => {
  //Si le nombre de lettre saisie est inférieur au nombre de lettre deviné
  if (currentGuess.length < word.length) {
    const upper = letter.toUpperCase(); // On ajoute la lettre en majuscule
    //updateCase(ligne,case,lettre)
    updateCase(currentTry, currentGuess.length, upper);
    currentGuess += upper;
  }
};

//Supprimer la lettre

const handleBackspace = () => {
  currentGuess = currentGuess.slice(0, -1); // Si la touche est 'Backspace', on enlève la dernière lettre
  clearCase(currentTry, currentGuess.length);
};

/*5.***************fonction qui gère la validation en appuyant sur la touche Enter**********/

const keyEnter = (key) => {
  if (key !== "Enter") return; // On ne continue que si on appuie sur Entrée

  //on stocke chaque lettre dans de mot à deviner ou de mot taper dans un tableau
  const secret = word.split("");
  const guess = currentGuess.split("");
  /**
   * suit chaque lettre qui a déjà été valiser comme bien placée pour ne pas le revalider
   * array(word.length) : crée un tableau vide qui va contenir word.length elements
   * fill(false) : remplie le tableau avec les mots false
   * const checked = [false, false, false, false, false];
   */
  const checked = Array(word.length).fill(false);

  const divValidate = document.getElementById("validate");
  const spanValidate = document.createElement("span");
  spanValidate.style.margin = "10px";
  divValidate.innerHTML = ""; // on le vide au cas où

  // 1. Vérifier la longueur du mot saisi
  if (currentGuess.length !== word.length) {
    spanValidate.textContent = "Mot trop court ou trop long !";
    divValidate.appendChild(spanValidate);
    return;
  }

  // 2. Étape 1 : lettres bien placées (vert)
  for (let i = 0; i < word.length; i++) {
    if (guess[i] === secret[i]) {
      //colorie la ligne et colonne actuel en vert
      colorCase(currentTry, i, "green");
      colorVirtualKey(guess[i], "green");
      checked[i] = true;
      secret[i] = null; //la lettre passe à null dans le tableau pour ne pas la retraité
      guess[i] = null;
    }
  }

  // 2. Étape 2 : lettres présentes mais mal placées (orange), sinon (rouge)
  for (let i = 0; i < word.length; i++) {
    if (guess[i] !== null) {
      //stocke l'index de la lettre actuelle dans le mot secret
      const pos = secret.indexOf(guess[i]);
      if (pos !== -1) {
        colorCase(currentTry, i, "orange");
        colorVirtualKey(guess[i], "orange");
        secret[pos] = null;
      } else {
        colorCase(currentTry, i, "red");
        colorVirtualKey(guess[i], "red");
      }
    }
  }

  // 3. Vérification du mot
  if (currentGuess === word) {
    // spanValidate.textContent = "Bravo ! Vous avez trouvé le pays : " + word;
    // divValidate.appendChild(spanValidate);
    // createReplayButton();
    showModal(word);
    return;
  }

  // 5. Mauvais mot, essai suivant
  const essaisRestants = maxTries - currentTry - 1; //-1 car cuurentTry commence à 0
  spanValidate.textContent =
    essaisRestants > 0
      ? "Mauvais mot. Essais restants : " + essaisRestants
      : "Plus d'essais ! Le mot était : " + word;

  divValidate.appendChild(spanValidate);
  //   createReplayButton();

  //on passe à la ligne suivante
  currentTry++;
  //après avoir valider un mot, on repart à o pour saisir un nouveau mot
  currentGuess = "";
};
/************************************************************ */
//********5.1 affiche les lettres dans les bonne cases

const updateCase = (lineIndex, letterIndex, letter) => {
  const board = document.getElementById("board");
  const line = board.children[lineIndex]; //on recupère la ligne
  const caseSpan = line.children[letterIndex]; // on recupère la case sur la ligne
  caseSpan.textContent = letter; // on remplie la case
};

//fonction qui gère la coloration des cases
const colorCase = (lineIndex, letterIndex, color) => {
  const board = document.getElementById("board");
  const line = board.children[lineIndex];
  const span = line.children[letterIndex];
  span.style.backgroundColor = color;
  span.style.color = "white"; // pour bien voir la lettre
};

//coloration de clavier virtuel
const colorVirtualKey = (letter, color) => {
  const keys = document.querySelectorAll(".key");

  keys.forEach((key) => {
    // on ignore si ce n'est pas la lettre concernée
    if (key.textContent !== letter) return;

    // priorité de couleurs : vert > orange > rouge
    const currentColor = key.style.backgroundColor;

    if (
      currentColor === "green" ||
      (currentColor === "orange" && color === "red")
    ) {
      return; // ne pas écraser le vert ou orange avec du rouge
    }

    key.style.backgroundColor = color;
    key.style.color = "white";
  });
};

//suppression des lettres
const clearCase = (lineIndex, letterIndex) => {
  const board = document.getElementById("board");
  const line = board.children[lineIndex];
  const caseSpan = line.children[letterIndex];
  caseSpan.textContent = "";
};

//bouton rejouer

const createReplayButton = () => {
  const divValidate = document.getElementById("validate");
  const replayButton = document.createElement("button");
  replayButton.textContent = "REJOUER";
  replayButton.classList.add("btn");

  // Quand on clique, on recharge la page
  replayButton.addEventListener("click", () => {
    window.location.reload();
  });

  divValidate.appendChild(replayButton);
};

//Ajout de clavier virtuel

const createVirtualKeyboard = () => {
  const div = document.getElementById("keyboard");

  const keyboard = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["←", "W", "X", "C", "V", "B", "N", "ENTER"],
  ];

  keyboard.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    row.forEach((key) => {
      const button = document.createElement("button");
      button.textContent = key;
      button.classList.add("key");

      button.addEventListener("click", () => {
        if (key === "←") {
          button.classList.add("backspace", "key");
          handleBackspace();
        } else if (key === "ENTER") {
          button.classList.add("key", "enter");
          keyEnter("Enter");
        } else {
          button.classList.add("key");
          addLetter(key);
        }
      });

      rowDiv.appendChild(button);
    });

    div.appendChild(rowDiv);
  });
};

// Ajout de modal

const showModal = (word) => {
  const modal = document.getElementById("winModal");
  const text = document.getElementById("modalText");
  const closeBtn = document.getElementById("closeModal");
  // const playAgainBtn = document.getElementById("playAgain");

  text.textContent = `Vous avez trouvé : ${word}`;

  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  createReplayButton();

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
};

window.onload = () => {
  getData();
  createVirtualKeyboard();
};
