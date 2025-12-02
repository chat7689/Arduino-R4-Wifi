const FIREBASE_BASE = "arduino-r4-wifi-default-rtdb.firebaseio.com";

function updateStepper() {
  const steps = document.getElementById("stepperInput").value;
  fetch(`https://${FIREBASE_BASE}/stepper/steps.json`, {
    method: "PUT",
    body: JSON.stringify(parseInt(steps))
  }).then(() => console.log("Stepper updated to", steps));
}

function updateServo() {
  const angle = document.getElementById("servoInput").value;
  fetch(`https://${FIREBASE_BASE}/servo/angle.json`, {
    method: "PUT",
    body: JSON.stringify(parseInt(angle))
  }).then(() => console.log("Servo updated to", angle));
}
