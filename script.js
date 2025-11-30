// Firebase imports (via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Buttons
document.getElementById("lcdBtn").addEventListener("click", () => {
  const text = document.getElementById("lcdText").value;
  set(ref(db, "lcd/text"), text)
    .then(() => console.log("lcd/text updated to", text))
    .catch(console.error);
});

document.getElementById("stepperBtn").addEventListener("click", () => {
  const steps = parseInt(document.getElementById("stepperSteps").value, 10);
  if (!isNaN(steps)) {
    set(ref(db, "stepper/steps"), steps)
      .then(() => console.log("stepper/steps updated to", steps))
      .catch(console.error);
  }
});
