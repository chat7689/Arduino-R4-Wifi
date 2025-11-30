const FIREBASE_BASE = "arduino-r4-wifi-default-rtdb.firebaseio.com";

// Helper to send PUT request to Firebase
async function updateFirebase(path, value) {
  const url = `https://${FIREBASE_BASE}/${path}.json`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value)
    });
    if (!response.ok) throw new Error("Failed to update Firebase");
    console.log(`${path} updated to`, value);
  } catch (err) {
    console.error(err);
  }
}

// --- Button functions ---
function updateLCD() {
  const text = document.getElementById("lcdText").value;
  updateFirebase("lcd/text", text);
}

function updateServo1() {
  const angle = parseInt(document.getElementById("servo1").value);
  updateFirebase("servo1/angle", angle);
}

function updateServo2() {
  const angle = parseInt(document.getElementById("servo2").value);
  updateFirebase("servo2/angle", angle);
}

function updateStepper() {
  const steps = parseInt(document.getElementById("stepper").value);
  updateFirebase("stepper/steps", steps);
}
