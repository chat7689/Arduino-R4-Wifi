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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const stepperSlider = document.getElementById('stepper');
const servoSlider = document.getElementById('servo');
const stepperVal = document.getElementById('stepperVal');
const servoVal = document.getElementById('servoVal');

stepperSlider.addEventListener('input', e => {
  const val = parseInt(e.target.value);
  stepperVal.textContent = val;
  db.ref('stepper/angle').set(val);
});

servoSlider.addEventListener('input', e => {
  const val = parseInt(e.target.value);
  servoVal.textContent = val;
  db.ref('servo/angle').set(val);
});

// Listen for updates from Firebase (in case another client changes it)
db.ref('stepper/angle').on('value', snapshot => {
  const val = snapshot.val();
  stepperVal.textContent = val;
  stepperSlider.value = val;
});
db.ref('servo/angle').on('value', snapshot => {
  const val = snapshot.val();
  servoVal.textContent = val;
  servoSlider.value = val;
});
