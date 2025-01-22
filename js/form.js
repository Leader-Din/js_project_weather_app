// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvWdj1qmlaHz6jHEHfGXXSDjg4JGfBSvQ",
  authDomain: "weather-52bdf.firebaseapp.com",
  databaseURL: "https://weather-52bdf-default-rtdb.firebaseio.com",
  projectId: "weather-52bdf",
  storageBucket: "weather-52bdf.firebasestorage.app",
  messagingSenderId: "1024336697765",
  appId: "1:1024336697765:web:b1303ab8aba26b103d304c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Submit form data
document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default form submission

  // Get user input values
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validate inputs
  if (!username || !email || !phone) {
    alert("All fields are required.");
    return;
  }

  // Save data to Firebase Realtime Database
  set(ref(db, "user/" + username), { username, email, phoneNumber: phone })
    .then(() => {
      alert("Data saved successfully!");

      // Optionally clear form fields after successful submission
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone").value = "";
    })
    .catch((error) => {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    });
});

console.log("Form initialized and ready to submit data.");
