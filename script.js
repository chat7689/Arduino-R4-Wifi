const FIREBASE_DB_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

const sendButton = document.getElementById("sendButton");
const lcdInput = document.getElementById("lcdInput");
const statusDisplay = document.getElementById("statusDisplay");
const currentLCDText = document.getElementById("currentLCDText");

async function sendToLCD(text) {
  const trimmed = text.substring(0, 32);
  statusDisplay.textContent = "Sending...";
  try {
    const response = await fetch(FIREBASE_DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed)
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    statusDisplay.textContent = `Sent: "${trimmed}"`;
    lcdInput.value = "";
  } catch(err) {
    statusDisplay.textContent = "Error sending message";
    console.error(err);
  }
}

async function updateCurrentText() {
  try {
    const response = await fetch(FIREBASE_DB_URL);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const text = await response.json();
    currentLCDText.textContent = text || "";
  } catch(err) {
    currentLCDText.textContent = "Error loading text";
    console.error(err);
  }
}

sendButton.addEventListener("click", () => {
  const msg = lcdInput.value;
  if (msg.length > 0) sendToLCD(msg);
});

setInterval(updateCurrentText, 2000);
updateCurrentText();
