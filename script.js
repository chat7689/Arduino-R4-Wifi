// Firebase Realtime Database URL (HTTP for UNO R4)
const FIREBASE_DB_URL = "http://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

const sendBtn = document.getElementById("sendBtn");
const lcdInput = document.getElementById("lcdMessage");
const statusEl = document.getElementById("status");
const currentTextEl = document.getElementById("currentText");

// Send message to Firebase
async function sendToLCD(text) {
  const trimmed = text.substring(0, 32); // limit to 32 chars
  statusEl.textContent = "Sending...";

  try {
    const response = await fetch(FIREBASE_DB_URL, {
      method: "PUT",  // replace value at /lcd/text
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed)
    });

    if (!response.ok) throw new Error("HTTP " + response.status);
    statusEl.textContent = `Sent: "${trimmed}"`;
    lcdInput.value = "";
  } catch (err) {
    statusEl.textContent = "Error sending message!";
    console.error(err);
  }
}

// Update the current LCD text live
async function updateCurrentText() {
  try {
    const response = await fetch(FIREBASE_DB_URL);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const text = await response.json();
    currentTextEl.textContent = text || "";
  } catch (err) {
    currentTextEl.textContent = "Error loading text";
    console.error(err);
  }
}

// Event listener for sending
sendBtn.addEventListener("click", () => {
  const msg = lcdInput.value;
  if (msg.length > 0) sendToLCD(msg);
});

// Poll Firebase every 2 seconds to update live text
setInterval(updateCurrentText, 2000);

// Initial load
updateCurrentText();
