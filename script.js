// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXUCyz6oI23ndD03ejKuDj3_V8oK9JLvQ",
  authDomain: "arduino-r4-wifi.firebaseapp.com",
  databaseURL: "https://arduino-r4-wifi-default-rtdb.firebaseio.com",
  projectId: "arduino-r4-wifi",
  storageBucket: "arduino-r4-wifi.appspot.com",
  messagingSenderId: "100197280714",
  appId: "1:100197280714:web:a58b8e6a573c70bdd3bd33"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Update functions
function updateLCD(){
  const val = document.getElementById("lcdInput").value;
  db.ref("lcd/text").set(val);
}

function updateServo(){
  const val = parseInt(document.getElementById("servoInput").value);
  db.ref("servo/angle").set(val);
}

function updateStepper(){
  const val = parseInt(document.getElementById("stepperInput").value);
  db.ref("stepper/steps").set(val);
}
