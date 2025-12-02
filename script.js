// Firebase config (replace with your own project info)
const firebaseConfig = {
  apiKey: "AIzaSyDXUCyz6oI23ndD03ejKuDj3_V8oK9JLvQ",
  authDomain: "arduino-r4-wifi.firebaseapp.com",
  databaseURL: "https://arduino-r4-wifi-default-rtdb.firebaseio.com",
  projectId: "arduino-r4-wifi",
  storageBucket: "arduino-r4-wifi.appspot.com",
  messagingSenderId: "100197280714",
  appId: "1:100197280714:web:a58b8e6a573c70bdd3bd33"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const servoSlider = document.getElementById('servoSlider');
const servoVal = document.getElementById('servoVal');
const stepperSlider = document.getElementById('stepperSlider');
const stepperVal = document.getElementById('stepperVal');

// Update Firebase on slider change
servoSlider.oninput = () => {
  const val = parseInt(servoSlider.value);
  servoVal.innerText = val;
  db.ref('servo/angle').set(val);
};

stepperSlider.oninput = () => {
  const val = parseInt(stepperSlider.value);
  stepperVal.innerText = val;
  db.ref('stepper/angle').set(val);
};

// Listen to Firebase updates (real-time)
db.ref('servo/angle').on('value', snap => {
  const val = snap.val();
  servoSlider.value = val;
  servoVal.innerText = val;
});

db.ref('stepper/angle').on('value', snap => {
  const val = snap.val();
  stepperSlider.value = val;
  stepperVal.innerText = val;
});
