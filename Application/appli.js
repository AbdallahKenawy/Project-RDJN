import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js';
import { getFirestore, collection, addDoc, doc, updateDoc ,deleteDoc,query, where,orderBy } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';
import { getStorage,deleteObject, ref} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyDjzk264YyS9iHYfNXoxLq7PXs0le-EQT4",
  authDomain: "applibde-ac4c2.firebaseapp.com",
  projectId: "applibde-ac4c2",
  storageBucket: "applibde-ac4c2.appspot.com",
  messagingSenderId: "647635051162",
  appId: "1:647635051162:web:d49583ac1cd2330d98f523",
  measurementId: "G-9N8JGWXR4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to show notifications
function showNotification(message, type) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block';

    // Hide the notification after a few seconds (optional)
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 5000); // Hide after 5 seconds
}

document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const start = new Date(document.getElementById('start').value);
    const end = new Date(document.getElementById('end').value);
    const pole = document.getElementById('pole').value;
    const link = document.getElementById('link').value;

    // Create the document data object
    let eventData = {
        title: title,
        description: description,
        start: start,
        end: end,
        pole: pole
    };

    // Conditionally add the link field if it's not empty
    if (link.trim() !== '') {
        eventData.link = link;
    }

    try {
        // Add a new document in collection "event" with the eventData
        const docRef = await addDoc(collection(db, "event"), eventData);
        showNotification('Événement ajouté avec succès à Firestore avec l\'ID: ' + docRef.id, 'success');
        
        // Clear all input fields after successful submission
        document.getElementById('eventForm').reset();
    } catch (e) {
        showNotification('Erreur lors de l\'ajout de l\'événement: ' + e.message, 'error');
    }
});
