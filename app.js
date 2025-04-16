// Handling form submission
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    let productName = document.getElementById('product-name').value;
    let serialRange = document.getElementById('serial-range').value;

    // Process serial range, e.g., A001 to A100
    let serials = processSerialRange(serialRange);

    // Store in localStorage for simplicity
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push({ productName, serials });
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Add to Firestore
    addProductToFirestore(productName, serials);

    alert('Product added!');
});

// Function to add product to Firestore
function addProductToFirestore(productName, serials) {
    db.collection('products').add({
        productName: productName,  // Name of the product
        serials: serials           // Array of serial numbers
    })
    .then(() => {
        console.log('Product successfully added to Firestore!');
        displayInventory();  // Refresh inventory view after adding
    })
    .catch((error) => {
        console.error('Error adding product to Firestore: ', error);
    });
}

// Function to display inventory data from localStorage and Firestore
function displayInventory() {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let table = document.getElementById('inventory-table');
    table.innerHTML = ''; // Clear the existing table

    // Display localStorage inventory data first
    inventory.forEach(item => {
        let row = table.insertRow();
        let productNameCell = row.insertCell(0);
        productNameCell.textContent = item.productName;
        let serialsCell = row.insertCell(1);
        serialsCell.textContent = item.serials.join(', ');
    });

    // Fetch and display data from Firestore
    db.collection('products').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let row = table.insertRow();
                let productNameCell = row.insertCell(0);
                productNameCell.textContent = doc.data().productName;
                let serialsCell = row.insertCell(1);
                serialsCell.textContent = doc.data().serials.join(', ');
            });
        })
        .catch((error) => {
            console.error("Error getting Firestore documents: ", error);
        });
}

window.onload = displayInventory;

// Function to process serial range (e.g., "A001 to A100")
function processSerialRange(range) {
    let [start, end] = range.split(' to ');
    let serials = [];
    for (let i = parseInt(start.slice(1)), j = parseInt(end.slice(1)); i <= j; i++) {
        serials.push(start[0] + i.toString().padStart(3, '0'));
    }
    return serials;
}

// Firebase Configuration and Initialization
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCD3Gu4Mj8nnX3CCk3zrC_qfhTFMulzs-k",
    authDomain: "sysbot-resource.firebaseapp.com",
    projectId: "sysbot-resource",
    storageBucket: "sysbot-resource.firebasestorage.app",
    messagingSenderId: "512194246795",
    appId: "1:512194246795:web:919754d19cb6697cf13c8e"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const db = firebase.firestore();
