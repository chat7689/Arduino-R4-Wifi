const FIREBASE_BASE = "arduino-r4-wifi-default-rtdb.firebaseio.com";

const stepperSlider = document.getElementById("stepperSlider");
const servoSlider = document.getElementById("servoSlider");
const stepperStepsText = document.getElementById("stepperSteps");
const stepperDegreesText = document.getElementById("stepperDegrees");
const servoAngleText = document.getElementById("servoAngle");

// Convert steps to degrees (28BYJ-48 stepper)
function stepsToDegrees(steps) {
  return ((steps % 4096) / 4096) * 360;
}

// Update Firebase
function updateStepper() {
  const steps = parseInt(stepperSlider.value);
  fetch(`https://${FIREBASE_BASE}/stepper/steps.json`, {
    method: "PUT",
    body: JSON.stringify(steps)
  });
}

function updateServo() {
  const angle = parseInt(servoSlider.value);
  fetch(`https://${FIREBASE_BASE}/servo/angle.json`, {
    method: "PUT",
    body: JSON.stringify(angle)
  });
}

// Update UI
function updateUI(stepperSteps, servoAngle) {
  stepperStepsText.innerText = stepperSteps;
  stepperDegreesText.innerText = stepsToDegrees(stepperSteps).toFixed(1) + "°";
  servoAngleText.innerText = servoAngle + "°";
  stepperSlider.value = stepperSteps;
  servoSlider.value = servoAngle;
}

// Event listeners
stepperSlider.addEventListener("input", updateStepper);
servoSlider.addEventListener("input", updateServo);

// Poll Firebase every 500ms
async function pollFirebase() {
  try {
    const stepperRes = await fetch(`https://${FIREBASE_BASE}/stepper/steps.json`);
    const stepperSteps = await stepperRes.json();

    const servoRes = await fetch(`https://${FIREBASE_BASE}/servo/angle.json`);
    const servoAngle = await servoRes.json();

    updateUI(stepperSteps, servoAngle);
  } catch (err) {
    console.error("Firebase poll error:", err);
  }

  setTimeout(pollFirebase, 500);
}

// Start polling
pollFirebase();
