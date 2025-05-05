import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getFirestore, collection, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where,orderBy } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';
import { getStorage, deleteObject, ref } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js';

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
const storage = getStorage(app);

async function getreports() {
    const q = query(collection(db, "posts"), where("reports", ">=", 1), orderBy("reports","asc"));
    const querySnapshot = await getDocs(q);
    document.getElementById('documentDetails').innerHTML = '';
    querySnapshot.forEach((document) => {
        displayReportDetails(document.id, document.data());
    });
}

async function displayReportDetails(docId, documentData) {
    const userRef = doc(db, 'users', documentData.userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        console.log("User not found");
        return;
    }
    const user = userSnap.data();

    const container = document.createElement('div');
    container.className = 'document-card';
    document.getElementById('documentDetails').appendChild(container);

    const timestamp = documentData.timestamp; // Assuming this is your Firestore Timestamp object
    const date = timestamp.toDate(); // Converts to JavaScript Date object

    // Extract components using get methods
    const day = date.getDate().toString().padStart(2, '0'); // Day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (getMonth() is zero-based)
    const year = date.getFullYear().toString().substr(-2); // Last two digits of the year
    const hours = date.getHours().toString().padStart(2, '0'); // Hours
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutes

    // Construct the formatted date string
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    container.appendChild(document.createTextNode(`${user.firstName} ${user.lastName} - ${formattedDate} - Reports: ${documentData.reports}`));
    container.appendChild(document.createElement('br'));

    const photoImage = document.createElement('img');
    photoImage.src = documentData.imageUrl;
    photoImage.alt = 'Document Photo';
    container.appendChild(photoImage);

    const clearReportsButton = document.createElement('button');
    clearReportsButton.textContent = 'Enlever Signalement';
    clearReportsButton.onclick = () => {
        updateDoc(doc(db, "posts", docId), { reports: 0 });
    };
    clearReportsButton.className = 'button-valider';
    container.appendChild(clearReportsButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer Post';
    deleteButton.className = 'button-delete';
    deleteButton.onclick = async () => {
        await deleteDocumentAndFile(docId, documentData.photoUrl);
        container.remove();
    };
    container.appendChild(deleteButton);

    const deleteUserButton = document.createElement('button');
    deleteUserButton.textContent = 'Supprimer Utilisateur';
    deleteUserButton.className = 'button-delete';
    deleteUserButton.onclick = async () => {
        console.log("Delete user functionality to be implemented securely.");
    };
    container.appendChild(deleteUserButton);
}

async function deleteFile(fileUrl) {
    const decodedUrl = decodeURIComponent(fileUrl);
    const matches = decodedUrl.match(/\/o\/(.+)?\?alt=media/);
    if (matches && matches.length > 1) {
        const filePath = matches[1];
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
    }
}

async function deleteDocument(docId) {
    await deleteDoc(doc(db, 'posts', docId));
}

async function deleteDocumentAndFile(docId, fileUrl) {
    await deleteDocument(docId);
    if (fileUrl) {
        await deleteFile(fileUrl);
    }
}

document.addEventListener('DOMContentLoaded', async (event) => {
    await getreports();
});
