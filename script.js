document.addEventListener("DOMContentLoaded", () => {
  const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

  const input = document.getElementById("textInput");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  let typingTimer;
  const TYPING_DELAY = 150; // Live update delay

  function updateStatus(color, text) {
    statusDot.style.background = color;
    statusText.textContent = text;
  }

  // Live updates while typing
  input.addEventListener("input", () => {
    updateStatus("#f1c40f", "Typing...");
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      sendToFirebase(input.value);
    }, TYPING_DELAY);
  });

  function sendToFirebase(text) {
    updateStatus("#2a84ff", "Sending...");

    fetch(FIREBASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(text)
    })
    .then(r => r.text())
    .then(() => {
      updateStatus("#2ecc71", "Live");
      setTimeout(() => updateStatus("#2a84ff", "Idle"), 400);
    })
    .catch(() => {
      updateStatus("#e74c3c", "Error");
    });
  }
});
