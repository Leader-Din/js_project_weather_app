
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getDatabase , ref , set ,get , child } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAMYlm9uAuCea-rBQHgZMBmbBD47De5_Xs",
    authDomain: "weather-f7836.firebaseapp.com",
    projectId: "weather-f7836",
    storageBucket: "weather-f7836.firebasestorage.app",
    messagingSenderId: "256132267970",
    appId: "1:256132267970:web:09443229d1a692979da05b"
  };

  const app = initializeApp(firebaseConfig);

//get ref to database services
 const db = getDatabase(app);

 document.getElementById("submit").addEventListener('click', function(e){
  e.preventDefault();
  set(ref(db, 'user/' + document.getElementById("username").value),
  {

    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    PhoneNumber: document.getElementById("phone").value

  });
    alert("Login Sucessfull  !");
 })