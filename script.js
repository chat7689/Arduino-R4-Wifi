const FIREBASE_BASE = "https://arduino-r4-wifi-default-rtdb.firebaseio.com";

async function updateStepper() {
  const val = document.getElementById("stepperInput").value;
  await fetch(`${FIREBASE_BASE}/stepper/degree.json`, {
    method: "PUT",
    body: val
  });
  document.getElementById("currentStepper").innerText = val;
}

async function updateServo() {
  const val = document.getElementById("servoInput").value;
  await fetch(`${FIREBASE_BASE}/servo/angle.json`, {
    method: "PUT",
    body: val
  });
  document.getElementById("currentServo").innerText = val;
}

// Optional: Poll Firebase to update current values automatically
setInterval(async () => {
  const stepRes = await fetch(`${FIREBASE_BASE}/stepper/degree.json`);
  const stepVal = await stepRes.text();
  document.getElementById("currentStepper").innerText = stepVal;

  const servoRes = await fetch(`${FIREBASE_BASE}/servo/angle.json`);
  const servoVal = await servoRes.text();
  document.getElementById("currentServo").innerText = servoVal;
}, 1000);
