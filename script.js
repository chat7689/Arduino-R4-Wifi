const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

// Make sure the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("textInput");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  let typingTimer;
  const TYPING_DELAY = 150; // Smart-Live delay

  function updateStatus(color, text) {
    statusDot.style.background = color;
    statusText.textContent = text;
  }

  // Trigger live updates as user types
  input.addEventListener("input", () => {
    updateStatus("#f1c40f", "Typing...");
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      sendToFirebase(input.value);
    }, TYPING_DELAY);
  });

  // Upload text to Firebase
  function sendToFirebase(text) {
    updateStatus("#2a84ff", "Sending...");

    fetch(FIREBASE_URL, {
      method: "PUT",
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
