console.log("Script loaded ✅");

const URL = "./model/";
let model;
const video = document.getElementById("webcam");
const canvas = document.getElementById("webcam-canvas");
const ctx = canvas.getContext("2d");

const roasts = [
    "Even snails move faster than you 🐌.",
    "At this rate, your textbook's growing dust.",
    "You and that chair have fused.",
    "Motivation not found. Try again.",
    "This is not Netflix. Keep working!"
];

const praise = [
    "🔥 You're crushing it!",
    "Stay in the zone!",
    "Focus level: god-tier.",
    "Keep going, you're a beast!",
    "Productivity unlocked. 💪"
];

// 🔁 STEP 1: Load the model
async function init() {
    console.log("Initializing model...");

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Model loaded ✅");
    } catch (err) {
        console.error("Model loading failed ❌", err);
        return;
    }

    // 🔁 STEP 2: Start webcam using native HTML5
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        console.log("Webcam stream started ✅");
    } catch (err) {
        console.error("Webcam access denied ❌", err);
        document.getElementById("outputText").innerText = "Please allow webcam access!";
    }
}

// 🔁 STEP 3: Take snapshot + predict
async function captureAndPredict() {
    ctx.drawImage(video, 0, 0, 224, 224); // draw current video frame onto canvas
    const prediction = await model.predict(canvas);

    let focusedProb = 0;
    let procrastinationProb = 0;

    for (let i = 0; i < prediction.length; i++) {
        const name = prediction[i].className.toLowerCase();
        if (name === "focused") focusedProb = prediction[i].probability;
        if (name === "procrastination") procrastinationProb = prediction[i].probability;
    }

    const label = focusedProb > procrastinationProb ? "focused" : "procrastination";
    const outputText = document.getElementById("outputText");

    if (label === "focused") {
        outputText.innerText = praise[Math.floor(Math.random() * praise.length)];
    } else {
        outputText.innerText = roasts[Math.floor(Math.random() * roasts.length)];
    }

    console.log("Focused:", focusedProb.toFixed(2), "Procrastination:", procrastinationProb.toFixed(2));

    // Update percentage text
    document.getElementById("focus-percent").innerText = Math.round(focusedProb * 100) + "%";
    document.getElementById("procrastination-percent").innerText = Math.round(procrastinationProb * 100) + "%";

    // Update bar widths
    document.getElementById("focus-bar").style.width = Math.round(focusedProb * 100) + "%";
    document.getElementById("procrastination-bar").style.width = Math.round(procrastinationProb * 100) + "%";

}

// ✅ Start app
init();
