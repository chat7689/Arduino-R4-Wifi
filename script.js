// Your Firebase configuration
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

// Update functions
function updateLCD() {
  const val = document.getElementById("lcdText").value;
  db.ref("lcd/text").set(val); // no quotes added, Arduino will show exact text
}

function updateServo1() {
  const val = parseInt(document.getElementById("servo1").value);
  db.ref("servo1/angle").set(val);
}

function updateServo2() {
  const val = parseInt(document.getElementById("servo2").value);
  db.ref("servo2/angle").set(val);
}

function updateStepper() {
  const val = parseInt(document.getElementById("stepper").value);
  db.ref("stepper/steps").set(val);
}
