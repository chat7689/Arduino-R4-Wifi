const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

const input = document.getElementById("textInput");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

let sendTimeout;
const DELAY = 120; // small delay so Firebase isn't spammed

function setStatus(color, text) {
  statusDot.style.backgroundColor = color;
  statusText.textContent = text;
}

input.addEventListener("input", () => {
  setStatus("#f1c40f", "Typing…");
  clearTimeout(sendTimeout);

  sendTimeout = setTimeout(() => {
    sendToFirebase(input.value);
  }, DELAY);
});

function sendToFirebase(text) {
  setStatus("#3498db", "Sending…");

  fetch(FIREBASE_URL, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(text.trim())
  })
  .then(() => {
    setStatus("#2ecc71", "Live");
    setTimeout(() => setStatus("#95a5a6", "Idle"), 500);
  })
  .catch(() => {
    setStatus("#e74c3c", "Error");
  });
}
