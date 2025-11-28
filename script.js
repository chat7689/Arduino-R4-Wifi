const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/arduino.json";

async function loadData() {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    document.getElementById("temp").textContent = data?.message ?? "No data";
    document.getElementById("last").textContent = "—"; // no timestamp
  } catch (err) {
    console.error(err);
    document.getElementById("temp").textContent = "Error";
  }
}

loadData();
setInterval(loadData, 2000);
