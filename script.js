// Firebase config (already public, no need to change)
const firebaseConfig = {
  apiKey: "AIzaSyDXUCyz6oI23ndD03ejKuDj3_V8oK9JLvQ",
  authDomain: "arduino-r4-wifi.firebaseapp.com",
  databaseURL: "https://arduino-r4-wifi-default-rtdb.firebaseio.com",
  projectId: "arduino-r4-wifi",
  storageBucket: "arduino-r4-wifi.firebasestorage.app",
  messagingSenderId: "100197280714",
  appId: "1:100197280714:web:a58b8e6a573c70bdd3bd33",
  measurementId: "G-35X2XRQ3WQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function updateStepper() {
  const steps = parseInt(document.getElementById("stepperInput").value);
  db.ref('stepper/steps').set(steps);
}

function updateServo() {
  const angle = parseInt(document.getElementById("servoInput").value);
  db.ref('servo1/angle').set(angle);
}
