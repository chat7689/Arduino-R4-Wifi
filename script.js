const FIREBASE_BASE = "arduino-r4-wifi-default-rtdb.firebaseio.com";

const stepperSlider = document.getElementById("stepperSlider");
const servoSlider = document.getElementById("servoSlider");

const stepperSliderValue = document.getElementById("stepperSliderValue");
const servoSliderValue = document.getElementById("servoSliderValue");

const stepperDegreesText = document.getElementById("stepperDegrees");
const servoAngleText = document.getElementById("servoAngle");

// Convert steps to degrees (28BYJ-48 stepper)
function stepsToDegrees(steps) {
  return ((steps % 4096) / 4096) * 360;
}

// Send updates to Firebase
function updateStepper() {
  const steps = parseInt(stepperSlider.value);
  stepperSliderValue.innerText = steps;
  fetch(`https://${FIREBASE_BASE}/stepper/steps.json`, {
    method: "PUT",
    body: JSON.stringify(steps)
  });
}

function updateServo() {
  const angle = parseInt(servoSlider.value);
  servoSliderValue.innerText = angle + "°";
  fetch(`https://${FIREBASE_BASE}/servo/angle.json`, {
    method: "PUT",
    body: JSON.stringify(angle)
  });
}

// Poll Firebase to display current positions
async function pollFirebase() {
  try {
    const stepperRes = await fetch(`https://${FIREBASE_BASE}/stepper/steps.json`);
    const stepperSteps = await stepperRes.json();
    stepperDegreesText.innerText = stepsToDegrees(stepperSteps).toFixed(1) + "°";

    const servoRes = await fetch(`https://${FIREBASE_BASE}/servo/angle.json`);
    const servoAngle = await servoRes.json();
    servoAngleText.innerText = servoAngle + "°";

  } catch (err) {
    console.error("Firebase poll error:", err);
  }
  setTimeout(pollFirebase, 500);
}

// Event listeners
stepperSlider.addEventListener("input", updateStepper);
servoSlider.addEventListener("input", updateServo);

// Start polling
pollFirebase();
