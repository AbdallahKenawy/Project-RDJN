const firebaseConfig = {
    apiKey: "AIzaSyDjzk264YyS9iHYfNXoxLq7PXs0le-EQT4",
    authDomain: "applibde-ac4c2.firebaseapp.com",
    projectId: "applibde-ac4c2",
    storageBucket: "applibde-ac4c2.appspot.com",
    messagingSenderId: "647635051162",
    appId: "1:647635051162:web:d49583ac1cd2330d98f523",
    measurementId: "G-9N8JGWXR4M"
};

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getFirestore, query, collection, where, getDocs, onSnapshot,writeBatch,doc,addDoc, arrayUnion,updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

let currdocId;
let numbers=[];
let chosennumbers=[];

initializeApp(firebaseConfig);
const db = getFirestore();

document.getElementById('join-game-button').addEventListener('click', async () => {
    const gameId = document.getElementById('game-id-input').value.trim();
    document.getElementById('message').style.display = 'block';
    if (!gameId) {
        document.getElementById('message').textContent = 'Veuillez retenter un code valable.';
        return;
    }
    await findGameById(gameId);
});

function setupRealTimeListener(docId) {
    const gameDocRef = doc(db, "bingo", docId);
    onSnapshot(gameDocRef, (doc) => {
        if (doc.exists()) {
            const gameData = doc.data();
            numbers = gameData.values;
            chosennumbers = gameData.nbrcoches || [];
            generateBingoBoard(numbers, chosennumbers);
            if (gameData.hasStarted) {
                checkForBingo();
            }
            // Additional logic...
        } else {
            console.log("No such document!");
        }
    }, (error) => {
        console.error("Error listening to the document:", error);
    });
}


async function findGameById(gameId) {
    const q = query(collection(db, "bingo"), where("id", "==", parseInt(gameId)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        document.getElementById('homepage').style.display = 'block';
        document.getElementById('join-section').style.display = 'none';
        document.getElementById('message').textContent = 'Veuillez retenter un code valable.';
        querySnapshot.forEach((doc) => {
            const gameData = doc.data();
            currdocId=doc.id
            setupRealTimeListener(currdocId);
            if (gameData.values && gameData.values.length === 25) {
                numbers = gameData.values; // Update the global array
            }
            if(gameData.nbrcoches){
                chosennumbers=gameData.nbrcoches;
            }
            if (gameData.isAdmin) {
                document.getElementById('admin-section').style.display = 'flex';
                document.getElementById('gamestart').style.display = 'block';
            }
                checkGameStart(doc.ref); // Listen for game start
        });
    } else {
        document.getElementById('message').textContent = 'Code faux. Veuillez retenter.';
    }
}

function checkGameStart(gameRef) {
    onSnapshot(gameRef, (doc) => {
        if (doc.data().hasStarted) {
            displayBingoGame();
        } else {
            document.getElementById('loading-screen').style.display = 'flex';
            document.getElementById('message').textContent = 'En salle d attente...';
        }
    });
}

document.getElementById('gamestart').addEventListener('click', async () => {
    const bingoCollectionRef = collection(db, 'bingo');
    const snapshot = await getDocs(bingoCollectionRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
        const docRef = doc(bingoCollectionRef, document.id);
        batch.update(docRef, { hasStarted: true });
    });
    await batch.commit();
    displayBingoGame();
});

function displayBingoGame() {
    document.getElementById('join-section').style.display = 'none';
    document.getElementById('gamestart').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'flex'; // Or 'flex' if you prefer
    generateBingoBoard(numbers,chosennumbers);
}

document.getElementById('gamestop').addEventListener('click', async () => {
    const bingoCollectionRef = collection(db, 'bingo');
    const snapshot = await getDocs(bingoCollectionRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
        const docRef = doc(bingoCollectionRef, document.id);
        batch.update(docRef, { hasStarted: false });
    });
    await batch.commit();
    stopBingoGame();
});

function stopBingoGame(){
    document.getElementById('join-section').style.display = 'none';
    document.getElementById('gamestart').style.display = 'block';
    document.getElementById('loading-screen').style.display = 'flex';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').textContent = 'Partie arrêtée';
    document.getElementById('bingo-game').style.display = 'none'; // Or 'flex' if you prefer
}

document.getElementById('homepage').addEventListener('click', async () => {
    document.getElementById('join-section').style.display = 'block';
    document.getElementById('gamestart').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('bingo-game').style.display = 'none';
    document.getElementById('homepage').style.display = 'none';
});

function generateBingoBoard(numbers, chosenNumbers) {
    const board = document.getElementById('bingo-board');
    board.innerHTML = ''; // Clear the board first

    let tr; // Declare `tr` outside of the loop to maintain its scope throughout the iterations
    numbers.forEach((number, index) => {
        if (index % 5 === 0) {
            tr = document.createElement('tr'); // Initialize a new row for every 5 numbers
            board.appendChild(tr);
        }
        const td = document.createElement('td');
        td.textContent = number;
        if (chosenNumbers.includes(number)) {
            td.classList.add('selected');
        }
        if (tr) { // This check ensures `tr` is defined before trying to append `td` to it
            tr.appendChild(td);
        }
    });

    checkForBingo(); // Check for bingo after the board is generated and marked
}

async function checkForBingo() {
    const board = document.getElementById('bingo-board');
    const rows = board.querySelectorAll('tr');
    const size = 5; // Size of the bingo board (5x5)
    let diagonals = [true, true]; // For tracking two diagonals
    let hasBingo = false; // Initially, no bingo

    // Check rows and prepare for column and diagonal checks
    for (let i = 0; i < size; i++) {
        let rowComplete = true;
        let colComplete = true;

        for (let j = 0; j < size; j++) {
            // Check rows
            if (!rows[i].children[j].classList.contains('selected')) {
                rowComplete = false;
            }
            // Check columns
            if (!rows[j].children[i].classList.contains('selected')) {
                colComplete = false;
            }
        }

        // Mark the corresponding BINGO letter as barred if a row is complete
        if (rowComplete) {
            document.getElementById('bingo-header').children[i].classList.add('barred');
            hasBingo = true; // Bingo condition met
        }

        // Optionally handle column completion
        if (colComplete) {
            // Implement column completion visual feedback if desired
            hasBingo = true; // Bingo condition met
        }
    }

    // Check diagonals
    if (!rows[0].children[0].classList.contains('selected')) { // Top-left to bottom-right
        diagonals[0] = false;
    }
    if (!rows[size - 1].children[0].classList.contains('selected')) { // Bottom-left to top-right
        diagonals[1] = false;
    }
    if (diagonals[0] || diagonals[1]) {
        // Implement diagonal completion visual feedback if desired
        // For simplicity, this example doesn't mark specific BINGO letters for diagonals
        hasBingo = true; // Bingo condition met
    }

    // Use the hasBingo flag for further logic, like announcing a winner
        if (hasBingo) {
            console.log('Bingo!');
            // Assuming you have stored the current game's document ID in a variable named `currentGameId`
            const gameDocRef = doc(db, "bingo", currdocId);
            try {
                await updateDoc(gameDocRef, {
                    hasBingo: true // Update the document field to true
                });
                console.log('Game document updated with bingo status.');
            } catch (error) {
                console.error('Error updating document:', error);
            }
    }
}


document.getElementById('nbr-confirmer').addEventListener('click', async () => {
    const inputValue = document.getElementById('nbr-input').value.trim();
    if (!inputValue) {
        console.error('The input is empty.');
        // Handle empty input, e.g., display a message to the user
        return;
    }
    
    // Convert inputValue to the desired format (e.g., number) if necessary
    const numberValue = parseInt(inputValue, 10);
    if (isNaN(numberValue)) {
        console.error('Invalid input. Please enter a number.');
        // Handle invalid input
        return;
    }
    
    await sendNumberToAllDocuments(numberValue);
});

async function sendNumberToAllDocuments(numberValue) {
    const bingoCollectionRef = collection(db, "bingo");
    const snapshot = await getDocs(bingoCollectionRef);
    
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
        const docRef = doc.ref; // Get a reference to the document
        batch.update(docRef, { nbrcoches: arrayUnion(numberValue) });
    });

    try {
        await batch.commit();
        console.log('All documents updated successfully.');
    } catch (e) {
        console.error('Error updating documents: ', e);
    }
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

document.getElementById('reset-game').addEventListener('click', async () => {
    const bingoCollectionRef = collection(db, "bingo");
    const snapshot = await getDocs(bingoCollectionRef);

    // Prepare a batch operation
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
        const docRef = doc.ref; // Get a reference to the document
        // Update the hasStarted, hasBingo fields to false, and clear the nbrCoches array
        batch.update(docRef, { hasStarted: false, hasBingo: false, nbrcoches: [] });
    });

    // Commit the batch
    try {
        await batch.commit();
        console.log('All documents reset successfully.');
    } catch (error) {
        console.error('Error resetting documents:', error);
    }
});

document.getElementById('create-game').addEventListener('click', async () => {
    const values = shuffleArray([...Array(99).keys()].map(i => i + 1)); // Create and shuffle the array
    const gameData = {
        isAdmin: false,
        hasStarted: false,
        id: 1,
        values: values.slice(0, 25),
        nbrcoches:[],
        hasBingo:false
    };

    try {
        const docRef = await addDoc(collection(db, "bingo"), gameData);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});