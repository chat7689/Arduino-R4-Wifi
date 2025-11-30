// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://arduino-r4-wifi-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function updateLCD() {
  const text = document.getElementById("lcdText").value;
  db.ref("lcd/text").set(text);
}

function updateServo1() {
  const angle = parseInt(document.getElementById("servo1Angle").value);
  db.ref("servo1/angle").set(angle);
}

function updateServo2() {
  const angle = parseInt(document.getElementById("servo2Angle").value);
  db.ref("servo2/angle").set(angle);
}

function updateStepper() {
  const steps = parseInt(document.getElementById("stepperSteps").value);
  db.ref("stepper/steps").set(steps);
}

// Optional: listen for updates and log to console
db.ref("lcd/text").on("value", snapshot => {
  console.log("LCD updated to:", snapshot.val());
});
db.ref("servo1/angle").on("value", snapshot => {
  console.log("Servo1 updated to:", snapshot.val());
});
db.ref("servo2/angle").on("value", snapshot => {
  console.log("Servo2 updated to:", snapshot.val());
});
db.ref("stepper/steps").on("value", snapshot => {
  console.log("Stepper updated to:", snapshot.val());
});
