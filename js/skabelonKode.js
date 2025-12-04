"use strict";

const bgSound = document.getElementById("bgSound");
const backgroundSound = new Audio(
  "lyde/baggrundLyd.mp3"
);

const havfrue2Sound = document.getElementById("havfrue2");

const havfrue2lyd = new Audio("lyde/skabelonIntroLyd.mp3");


//funktion der først bliver kaldt når man klikker som så spiller havfrue
function enableSound() {

setTimeout(() => {
  havfrue2lyd.play();
}, 100);

  document.removeEventListener('click', enableSound);
}

document.addEventListener('click', enableSound);



backgroundSound.loop = true;

//henter accessories 
const accessoryModal = document.getElementById("accessoryModal");
const accessoryPreview = document.getElementById("accessoryPreview");

// henter id fra canvas og toolbar er lines og clear knap

const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");

// sætter den til at tegne i 2d
const ctx = canvas.getContext("2d");

//henter template lag ind
const templateCanvas = document.getElementById("template-layer");
const templateCtx = templateCanvas.getContext("2d");

//laver canvas variable

let canvasRect;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  templateCanvas.width = rect.width;
  templateCanvas.height = rect.height;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Holder kun reference, tegner INTET ved load
let currentTemplateSrc = null;

// start med tomt template-lag
templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);

// sætter defaults for at tegne
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
ctx.strokeStyle = "#000000";

// clear canvas så der ikke er noget hvis man trykker på clear knappen
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// template clear
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "cleartemplate") {
    templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
  }
});

// ændrer strokebredde og farve inde i tooltips
toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    ctx.strokeStyle = e.target.value;
  }

  if (e.target.id === "lineWidth") {
    lineWidth = parseInt(e.target.value);
  }
});

// farvevalg eventlistener kigger på alle knapper med klassen color og sætter strokestyle til at være den farve som man klikker på
document.querySelectorAll(".color").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".color")
      .forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    ctx.strokeStyle = btn.dataset.color;
  });
});

// størrelsesknapper eventlistener her og kigger på alle knapper med klassen size og parser linjebredden så det er en int og sætter linjebredde
//til at være den størrelse som man har valgt
document.querySelectorAll(".size").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".size")
      .forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    lineWidth = parseInt(btn.dataset.size);
  });
});

document.querySelectorAll(".FiskeTemplate").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    //vis kun den som er valgt
    document
      .querySelectorAll(".FiskeTemplate")
      .forEach((el) => el.classList.remove("selected"));
    thumb.classList.add("selected");

    // ryd begge lag (så INTET kan “ligge bagved”)
    templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);

    // egn ny template, først når den er loadet
    const img = new Image();
    img.onload = () => {
      templateCtx.drawImage(
        img,
        0,
        0,
        templateCanvas.width,
        templateCanvas.height
      );
    };
    img.src = thumb.dataset.src; // fx "img/ravefjaslines.png"
  });
});

// starter ispainting hvis man trykker mus nede
canvas.addEventListener("mousedown", (e) => {
  isPainting = true;
  canvasRect = canvas.getBoundingClientRect();
  startX = e.clientX - canvasRect.left;
  startY = e.clientY - canvasRect.top;
  ctx.beginPath();
  ctx.moveTo(startX, startY);


   setTimeout(() => {
  backgroundSound.play();
}, 10);
});

// stopper ispainting hvis man giver slip på mus
canvas.addEventListener("mouseup", (e) => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
});

// begynder at tegne med den definerede linjebredde osv
// bliver kaldt når at man flytter mysen og is painting er true som den kun er når musen er holdt nede
const draw = (e) => {
  if (!isPainting) {
    return;
  }

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.lineTo(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
  ctx.stroke();
};

// eventlistener der aktiverer draw function når du bevæger mus
canvas.addEventListener("mousemove", draw);

// alt med localstorage kommer her, har også addet modal
const saveButton = document.getElementById("saveFish");
const modal2 = document.getElementById("fishModal");
const closeModal1 = document.getElementById("closeModal");
const closeModal2 = document.getElementById("closeModal2");
const imgPreview = document.getElementById("fishPreview");
const fishNameInput = document.getElementById("fishName");
const saveFishNameButton = document.getElementById("saveFishName");

// Åbner modal og viser fisken
saveButton.addEventListener("click", () => {
  // converter det til url så man kan sende img
  const drawingData = canvas.toDataURL("image/png");

  // gem til localstorage
  localStorage.setItem("savedDrawingOnly", drawingData);

  // Vis i modal
  imgPreview.src = drawingData;
  accessoryModal.style.display = "flex";
});


// Luk modal ved klik på X
closeModal1.addEventListener("click", () => {
  accessoryModal.style.display = "none";
});

// Luk modal ved klik på X
closeModal2.addEventListener("click", () => {
  modal2.style.display = "none";
});


// Luk modal ved klik udenfor boksen
modal2.addEventListener("click", (e) => {
  if (e.target === modal2) modal2.style.display = "none";
});

// Luk modal ved klik udenfor boksen
accessoryModal.addEventListener("click", (e) => {
  if (e.target === accessoryModal) accessoryModal.style.display = "none";
});

// gemfiskenanvn
saveFishNameButton.addEventListener("click", () => {
  const fishName = fishNameInput.value;

  // gem fiskenavn i localstorage
  localStorage.setItem("savedFishName", fishName);

  if (fishName) {
    //næste side
    window.location.href = "akvarium.html";
  }
});


// Havfrue2
// Fjern havfrue2 fra layout når animationen er færdig (sikrer ingen klik eller pladsoptag)
const havfrue2 = document.getElementById("havfrue2");

if (havfrue2) {
  havfrue2.addEventListener("animationend", () => {
    // Skjul helt efter animationen
    havfrue2.style.display = "none";
  });
}

const havfrueFjern = document.querySelector(".havfrue2");

// fjerner havfrue2 når at folk de klikker så man ikke skal sidde og vente
document.addEventListener("click", () => {
  havfrueFjern.style.display = "none";
});


//accessories eventlisteners
let chosenAccessory = null;

document.getElementById("brilleBtn").addEventListener("click", () => {
  chosenAccessory = "fiskeBrille.png";
  accessoryPreview.src = "img/fiskeBrille.png";
  accessoryPreview.style.display = "block";
});

document.getElementById("hatBtn").addEventListener("click", () => {
  chosenAccessory = "fiskeHat.png";
  accessoryPreview.src = "img/fiskeHat.png";
  accessoryPreview.style.display = "block";
});

document.getElementById("benBtn").addEventListener("click", () => {
  chosenAccessory = "fiskeBen.png";
  accessoryPreview.src = "img/fiskeBen.png";
  accessoryPreview.style.display = "block";
});



document.getElementById("accessoryDone").addEventListener("click", function () {

  // gemmer accessory
  localStorage.setItem("savedAccessory", chosenAccessory);

  // skuler accessory modal
  accessoryModal.style.display = "none";

  // viser navne modal
  modal2.style.display = "flex";

   // Load henter tegnet fisk
  const drawing = localStorage.getItem("savedDrawingOnly");
  document.getElementById("fishPreview2").src = drawing;

  // henter accessory som var valgt
  const acc = localStorage.getItem("savedAccessory");
  document.getElementById("accessoryPreview2").src = acc ? "img/" + acc : "";
});