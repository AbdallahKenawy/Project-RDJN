import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js';
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc ,deleteDoc,query, where,orderBy } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';
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
const storage = getStorage(app);

async function getDocuments(isAcceptedOnly, defiId, prenom,nom) {
  const challenges = await fetchChallenges();
  let queryConstraints = [];

  if (isAcceptedOnly) {
      queryConstraints.push(where("isAccepted", "==", false));
  }
  if (defiId) {
      queryConstraints.push(where("defiId", "==", defiId));
  }
  if (prenom) {
      queryConstraints.push(where("userFirstName", "==", prenom));
  }
  if(nom){
    queryConstraints.push(where("userLastName", "==", nom));
  }

    queryConstraints.push(orderBy("userUuid"));

  let querySnapshot;

  if (queryConstraints.length > 0) {
      querySnapshot = await getDocs(query(collection(db, "reponsesdefis"), ...queryConstraints));
  } else {
      querySnapshot = await getDocs(query(collection(db, "reponsesdefis").orderBy("userUuid")));
  }

  document.getElementById('documentDetails').innerHTML = ''; // Clear previous results
  querySnapshot.forEach((doc) => {
      const challenge = challenges.find(ch => ch.Numéro.toString() === doc.data().defiId); // Find the challenge by ID
      displayDocumentDetails(doc.data(), doc.id, challenge ? challenge.Défis : "Défi inconnu");
  });
}


async function displayDocumentDetails(doc, docId,challenge) {

    const container = document.createElement('div');
    container.className = 'document-card';
    document.getElementById('documentDetails').appendChild(container);

    container.appendChild(document.createTextNode(challenge));
    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));

    container.appendChild(document.createTextNode(`Swinguer : ${doc.userFirstName} ${doc.userLastName}`));
    container.appendChild(document.createElement('br'));

    // Create and append photo URL if available
    if (doc.photoUrl) {
        const lowerCaseUrl = doc.photoUrl.toLowerCase();
        if (lowerCaseUrl.includes('.mov') || lowerCaseUrl.includes('.mp4')) {
            const videoElement = document.createElement('video');
            videoElement.setAttribute('controls', 'controls');
            videoElement.setAttribute('src', doc.photoUrl);
            container.appendChild(videoElement);
        } else {
            const photoImage = document.createElement('img');
            photoImage.src = doc.photoUrl;
            photoImage.alt = 'Document Photo';
            container.appendChild(photoImage);
        }
        container.appendChild(document.createElement('br'));
        const downloadButton = document.createElement('a');
        downloadButton.href = doc.photoUrl; // URL to the file to be downloaded
        downloadButton.download = ""; // The download attribute. You can also specify a filename here.
        downloadButton.textContent = 'Télécharger';
        downloadButton.className = 'button-download'; // For styling
        container.appendChild(downloadButton);
    }

    const adminCommentInput = document.createElement('input');
    adminCommentInput.className='admin-input';
    adminCommentInput.value = doc.adminComment || '';
    container.appendChild(createLabelledElement('Commentaire : ', adminCommentInput));

    const isAcceptedCheckbox = document.createElement('input');
    isAcceptedCheckbox.type = 'checkbox';
    isAcceptedCheckbox.checked = doc.isAccepted || false;
    isAcceptedCheckbox.className='admin-checkbox';
    container.appendChild(createLabelledElement('Validé : ', isAcceptedCheckbox));

    // Create and append a validation button
    const validateButton = document.createElement('button');
    validateButton.textContent = 'Valider';
    validateButton.onclick = () => {
        const updatedData = {
            adminComment: adminCommentInput.value,
            isAccepted: isAcceptedCheckbox.checked
        };
        updateDocument(docId, updatedData);
        if(isAcceptedCheckbox.checked){
          container.remove();
        }
    };
    validateButton.className='button-valider';
    container.appendChild(validateButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.className = 'button-delete';
    deleteButton.onclick = async () => {
        try {
            deleteDocumentAndFile(docId, doc.photoUrl)
            container.remove();
        } catch (error) {
            console.error('Error deleting document or associated file:', error);
        }
    };
    container.appendChild(deleteButton);
}

function createLabelledElement(labelText, element) {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    wrapper.appendChild(label);
    wrapper.appendChild(element);
    return wrapper;
}


async function updateDocument(docId, data) {
    try {
        const docRef = doc(db, 'reponsesdefis', docId);
        await updateDoc(docRef, data);
        console.log('Document successfully updated');
        if (data.isAccepted) {
          const challengeDoc = await getDoc(docRef);
          if (!challengeDoc.exists()) throw new Error("Challenge document does not exist");

          const challengeData = challengeDoc.data();
          const userUuid = challengeData.userUuid;
          const defiId = challengeData.defiId;

          // Fetch the challenge's difficulty
          const challenges = await fetchChallenges();
          const challenge = challenges.find(ch => ch.Numéro.toString() === defiId);
          if (!challenge) throw new Error("Challenge not found");


          const userRef = doc(db, 'users', userUuid);
          // Again, use getDoc for a single document
          const userDocSnapshot = await getDoc(userRef);

          let newScore = userDocSnapshot.data().score || 0;

          switch (challenge.Difficulté) {
              case 'Facile':
                  newScore += 25;
                  break;
              case 'Intermédiaire':
                  newScore += 50;
                  break;
              case 'Difficile':
                  newScore += 100;
                  break;
              case 'Mythique':
                  newScore += 300;
                  break;
              default:
                  throw new Error("Unknown challenge difficulty");
          }
          await updateDoc(userRef, { score: newScore });
          console.log('User score successfully updated');
      }
  } catch (error) {
      console.error('Error updating document or user score:', error);
  }
}

async function fetchChallenges() {
    const response = await fetch('assets/Liste Défis.json');
    const challenges = await response.json();
    return challenges;
}

async function deleteFile(fileUrl) {
    try {
      const decodedUrl = decodeURIComponent(fileUrl);
      const matches = decodedUrl.match(/\/o\/(.+)?\?alt=media/);
      if (matches && matches.length > 1) {
        const filePath = matches[1];
        const fileRef = ref(storage, filePath);
  
        await deleteObject(fileRef);
        console.log('File successfully deleted');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

async function deleteDocument(docId) {
    try {
      await deleteDoc(doc(db, 'reponsesdefis', docId));
      console.log('Document successfully deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

async function deleteDocumentAndFile(docId, fileUrl) {
    await deleteDocument(docId);
    if (fileUrl) {
      await deleteFile(fileUrl);
    }
  }

function performSearch() {
    const isAcceptedOnly = !document.getElementById('isAcceptedCheckbox').checked;
    const defiId = document.getElementById('defiSelect').value;
    const nom = document.getElementById('NomInput').value.trim();
    const prenom = document.getElementById('PrenomInput').value.trim();

    getDocuments(isAcceptedOnly, defiId, prenom,nom).catch(error => console.error("Failed to fetch documents:", error));
}

async function populateDefiSelect() {
  const challenges = await fetchChallenges(); // Fetch the list of challenges
  const select = document.getElementById('defiSelect');
  select.innerHTML = '<option value="">Select a Défi</option>'; // Reset and add a default option

  challenges.forEach(challenge => {
      const option = document.createElement('option');
      option.value = challenge.Numéro.toString(); // Use Numéro as the value for querying
      option.textContent ="["+challenge.Difficulté+"] "+challenge.Défis; // Display Défis text
      select.appendChild(option);
  });
}


document.addEventListener('DOMContentLoaded', async (event) => {
  await populateDefiSelect();
  document.querySelector('.recherche-Valider').addEventListener('click', performSearch);
});


async function getCount(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.size; // This gives you the count of documents in the collection
}

// Example usage
getCount("reponsesdefis").then(count => {
  console.log("Number of documents in the collection:", count);
});
