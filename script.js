const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/arduino.json";

async function loadData() {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    document.getElementById("temp").textContent = data?.temperature ?? "No data";
    const t = data?.timestamp ? new Date(data.timestamp).toLocaleString() : "—";
    document.getElementById("last").textContent = t;
  } catch (err) {
    console.error(err);
    document.getElementById("temp").textContent = "Error";
  }
}

loadData();
setInterval(loadData, 2000);
