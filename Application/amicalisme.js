import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteField } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDjzk264YyS9iHYfNXoxLq7PXs0le-EQT4",
  authDomain: "applibde-ac4c2.firebaseapp.com",
  projectId: "applibde-ac4c2",
  storageBucket: "applibde-ac4c2.appspot.com",
  messagingSenderId: "647635051162",
  appId: "1:647635051162:web:d49583ac1cd2330d98f523",
  measurementId: "G-9N8JGWXR4M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Clean the numeroAmicaliste
function cleanNumeroAmicaliste(numero) {
    return numero.replace(/\D/g, '');
}

// Function to load JSON data
function loadJsonData(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problème de réseau: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            showNotification("Erreur lors du chargement des données Excel: " + error.message, "error");
            return null;
        });
}

// Function to show notifications
function showNotification(message, type) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block';

    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 5000); // Hide notification after 5 seconds
}

// General Update Function
async function generalUpdate(jsonData) {
    if (!jsonData) {
        showNotification("Échec du chargement des données Excel pour la mise à jour générale.", "error");
        return;
    }

    showNotification("Début de la mise à jour générale...", "success");

    // Iterate through all documents in the users collection and apply updates
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    usersSnapshot.forEach(async (doc) => {
        const userData = doc.data();
        const userLastName = userData.lastName.toLowerCase();
        const userFirstName = userData.firstName.toLowerCase();
        const userNumeroAmicaliste = cleanNumeroAmicaliste(userData.numeroAmicaliste);

        const matchingRecord = jsonData.find(record => 
            record.Nom.toLowerCase() === userLastName &&
            record.Prenom.toLowerCase() === userFirstName
        );

        if (matchingRecord) {
            const jsonNumeroAmicaliste = cleanNumeroAmicaliste(matchingRecord.Numeroamicaliste);
            const userDocRef = doc.ref;

            if (userNumeroAmicaliste === jsonNumeroAmicaliste) {
                const [day, month, year] = matchingRecord.Datefin.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day); // month is zero-indexed in JS

                await updateDoc(userDocRef, {
                    amicalisme: true,
                    datefinamicalisme: formattedDate
                });
            } else {
                await updateDoc(userDocRef, {
                    amicalisme: true,
                    datefinamicalisme: null
                });
            }
        } else {
            await updateDoc(userDocRef, {
                amicalisme: false,
                datefinamicalisme: deleteField()
            });
        }
    });

    showNotification("Mise à jour générale réussie.", "success");
}

// Specific User Update Function
async function updateSpecificUser(jsonData, firstName, lastName) {
    if (!jsonData) {
        showNotification("Échec du chargement des données Excel pour la mise à jour de l'utilisateur spécifique.", "error");
        return;
    }

    const usersCollection = collection(db, 'users');
    const userQuery = query(
        usersCollection,
        where('firstName', '==', firstName),
        where('lastName', '==', lastName)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        showNotification(`Aucun utilisateur trouvé avec le nom ${firstName} ${lastName} dans la base de données.`, "error");
        return;
    }

    userSnapshot.forEach(async (docSnapshot) => {
        const userData = docSnapshot.data();
        const userLastName = userData.lastName.toLowerCase();
        const userFirstName = userData.firstName.toLowerCase();
        const userNumeroAmicaliste = cleanNumeroAmicaliste(userData.numeroAmicaliste);

        const matchingRecord = jsonData.find(record => 
            record.Nom.toLowerCase() === userLastName &&
            record.Prenom.toLowerCase() === userFirstName
        );

        if (matchingRecord) {
            const jsonNumeroAmicaliste = cleanNumeroAmicaliste(matchingRecord.Numeroamicaliste);
            const userDocRef = docSnapshot.ref;

            // Displaying numeroAmicaliste values
            document.getElementById('jsonNumeroAmicaliste').textContent = jsonNumeroAmicaliste;
            document.getElementById('dbNumeroAmicaliste').textContent = userNumeroAmicaliste;

            if (userNumeroAmicaliste === jsonNumeroAmicaliste) {
                const [day, month, year] = matchingRecord.Datefin.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day); // month is zero-indexed in JS

                await updateDoc(userDocRef, {
                    amicalisme: true,
                    datefinamicalisme: formattedDate
                });
                showNotification(`Utilisateur ${firstName} ${lastName} mis à jour avec succès.`, "success");
            } else {
                await updateDoc(userDocRef, {
                    amicalisme: true,
                    datefinamicalisme: null
                });
                showNotification(`Utilisateur ${firstName} ${lastName} mis à jour avec des numéros Amicaliste différents.`, "warning");
            }
        } else {
            await updateDoc(docSnapshot.ref, {
                amicalisme: false,
                datefinamicalisme: deleteField()
            });
            showNotification(`Aucun enregistrement correspondant trouvé pour l'utilisateur ${firstName} ${lastName} dans les données Excel.`, "error");
        }
    });
}


// Event Listener for General Update Button
document.getElementById('generalUpdateButton').addEventListener('click', (event) => {
    event.preventDefault();  // Prevent the default action
    loadJsonData('output_data.json').then(jsonData => {
        generalUpdate(jsonData);
    });
});

// Event Listener for Specific User Update Button
document.getElementById('specificUpdateButton').addEventListener('click', (event) => {
    event.preventDefault();  // Prevent the default action
    document.getElementById('jsonNumeroAmicaliste').textContent='';
    document.getElementById('dbNumeroAmicaliste').textContent = '';
    // Get the input values
    const firstName = document.getElementById('firstNameInput').value.trim();
    const lastName = document.getElementById('lastNameInput').value.trim();

    if (firstName && lastName) {
        loadJsonData('output_data.json').then(jsonData => {
            updateSpecificUser(jsonData, firstName, lastName);
        });
    } else {
        showNotification("Veuillez entrer à la fois le prénom et le nom de famille.", "error");
    }
});