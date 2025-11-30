// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXUCyz6oI23ndD03ejKuDj3_V8oK9JLvQ",
  authDomain: "arduino-r4-wifi.firebaseapp.com",
  databaseURL: "https://arduino-r4-wifi-default-rtdb.firebaseio.com",
  projectId: "arduino-r4-wifi",
  storageBucket: "arduino-r4-wifi.firebasestorage.app",
  messagingSenderId: "100197280714",
  appId: "1:100197280714:web:a58b8e6a573c70bdd3bd33"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// LCD
const lcdBtn = document.getElementById("lcdBtn");
lcdBtn.addEventListener("click", () => {
  const text = document.getElementById("lcdText").value;
  db.ref("lcd/text").set(text)
    .then(() => console.log("lcd/text updated:", text))
    .catch(console.error);
});

// Stepper
const stepperBtn = document.getElementById("stepperBtn");
stepperBtn.addEventListener("click", () => {
  const steps = parseInt(document.getElementById("stepperSteps").value, 10);
  if (!isNaN(steps)) {
    db.ref("stepper/steps").set(steps)
      .then(() => console.log("stepper/steps updated:", steps))
      .catch(console.error);
  }
});

// Servo 1
const servo1Btn = document.getElementById("servo1Btn");
servo1Btn.addEventListener("click", () => {
  const angle = parseInt(document.getElementById("servo1Angle").value, 10);
  if (!isNaN(angle)) {
    db.ref("servo1/angle").set(angle)
      .then(() => console.log("servo1/angle updated:", angle))
      .catch(console.error);
  }
});

// Servo 2
const servo2Btn = document.getElementById("servo2Btn");
servo2Btn.addEventListener("click", () => {
  const angle = parseInt(document.getElementById("servo2Angle").value, 10);
  if (!isNaN(angle)) {
    db.ref("servo2/angle").set(angle)
      .then(() => console.log("servo2/angle updated:", angle))
      .catch(console.error);
  }
});
