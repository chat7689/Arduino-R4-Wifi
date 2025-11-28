const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/arduino.json";

async function loadData() {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    // Show Arduino message
    document.getElementById("message").textContent = data?.message ?? "No data";

    // Show time of last update
    document.getElementById("last").textContent = new Date().toLocaleTimeString();

  } catch (err) {
    console.error(err);
    document.getElementById("message").textContent = "Error fetching data";
    document.getElementById("last").textContent = "—";
  }
}

// Initial load
loadData();

// Refresh every 2 seconds
setInterval(loadData, 2000);
