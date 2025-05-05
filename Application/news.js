import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js';

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
const firestore = getFirestore(app);
const storage = getStorage(app);

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

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Pickr
    const pickr = Pickr.create({
        el: '#colorPicker',
        theme: 'classic',

        swatches: [
            'rgba(255, 87, 34, 1)',   // Deep Orange
            'rgba(255, 64, 129, 1)',  // Hot Pink
            'rgba(171, 71, 188, 1)',  // Medium Purple
            'rgba(94, 53, 177, 1)', // Royal Purple
            'rgba(48, 63, 159, 1)',// Indigo
            'rgba(25, 118, 210, 1)',// Bright Blue
            'rgba(0, 176, 255, 1)',// Sky Blue
            'rgba(0, 188, 212, 1)', // Cyan
            'rgba(0, 150, 136, 1)',// Teal
            'rgba(56, 142, 60, 1)', // Green
            'rgba(104, 159, 56, 1)',// Lime Green
            'rgba(192, 202, 51, 1)',// Yellow-Green
            'rgba(255, 214, 0, 1)',// Amber
            'rgba(255, 160, 0, 1)'   // Orange
        ],
        default: 'rgba(255,149,189, 1)',
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                input: true,
                clear: true,
                save: true
            }
        }
    });

    pickr.on('save', (color, instance) => {
        const rgbaColor = color.toRGBA();
        document.getElementById('r').value = Math.round(rgbaColor[0]);
        document.getElementById('g').value = Math.round(rgbaColor[1]);
        document.getElementById('b').value = Math.round(rgbaColor[2]);
        document.getElementById('o').value = rgbaColor[3];
        pickr.hide();
    });

    // Handle form submission
    document.getElementById('documentForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect data from the form
        var title = getInputVal('title');
        var description = getInputVal('description');
        var r = getInputVal('r');
        var g = getInputVal('g');
        var b = getInputVal('b');
        var o = getInputVal('o');
        var imageFile = document.getElementById('imageFile').files[0];

        // Upload the image first
        uploadImage(imageFile, function(imageName) {
            // After uploading, save document data with updated syntax
            saveDocument(title, description, r, g, b, o, imageName);
        });
    });
});

// Function to upload image to Firebase Storage
function uploadImage(imageFile, callback) {
    const storageRef = ref(storage, `news/${imageFile.name}`);
    uploadBytes(storageRef, imageFile).then((snapshot) => {
        showNotification('Image téléchargée avec succès!', 'success');
        callback(imageFile.name);
    }).catch((error) => {
        showNotification('Erreur lors du téléchargement de l\'image: ' + error.message, 'error');
    });
}

function saveDocument(title, description, r, g, b, o, imageName) {
    addDoc(collection(firestore, 'news'), {
        title,
        description,
        R: parseInt(r),
        G: parseInt(g),
        B: parseInt(b),
        O: parseFloat(o),
        image: imageName,
        createdAt: serverTimestamp()
    }).then(() => {
        showNotification('Document enregistré avec succès!', 'success');
        
        // Clear all input fields after successful submission
        document.getElementById('documentForm').reset();
    }).catch((error) => {
        showNotification('Erreur lors de l\'enregistrement du document: ' + error.message, 'error');
    });
}

// Helper function to get form values
function getInputVal(id) {
    return document.getElementById(id).value;
}
