"use strict";

document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  navigation.classList.toggle("is-open", isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    menuToggle.focus();
  }
});

const backgroundVideo = document.querySelector("#background-video");
const fullVideo = document.querySelector("#full-video");
const videoDialog = document.querySelector("#video-dialog");
const videoOpen = document.querySelector("#video-open");
const backgroundStatus = document.querySelector("#background-status");
const playerStatus = document.querySelector("#player-status");
let resumeBackground = false;

function playBackground() {
  backgroundVideo.play().then(() => {
    backgroundStatus.textContent = "";
  }).catch((error) => {
    if (error.name === "AbortError" && backgroundVideo.paused) {
      return;
    }
    console.error("No se pudo reproducir el video de fondo:", error);
    backgroundStatus.textContent = "No se pudo iniciar el fondo. Usa el icono de ampliar para abrir el reproductor.";
  });
}

backgroundVideo.addEventListener("error", () => {
  backgroundStatus.textContent = "No se pudo cargar el video. Puedes intentar abrirlo en el reproductor.";
  console.error("Error al cargar el video de fondo:", backgroundVideo.error);
});
fullVideo.addEventListener("error", () => {
  playerStatus.textContent = "No se pudo cargar el video. Intenta abrirlo directamente con el enlace inferior.";
  console.error("Error al cargar el video del reproductor:", fullVideo.error);
});

videoOpen.addEventListener("click", () => {
  resumeBackground = !backgroundVideo.paused;
  backgroundVideo.pause();
  playerStatus.textContent = "";
  videoDialog.showModal();
  fullVideo.currentTime = 0;
  fullVideo.play().catch((error) => {
    if (error.name === "AbortError" && !videoDialog.open) {
      return;
    }
    console.error("No se pudo iniciar el reproductor:", error);
    playerStatus.textContent = "No se pudo iniciar la reproducción. Usa los controles o abre el video directamente.";
  });
});

document.querySelector("#video-close").addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    videoDialog.close();
  }
});
videoDialog.addEventListener("click", (event) => {
  const bounds = videoDialog.getBoundingClientRect();
  if (event.target === videoDialog && (
    event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom
  )) {
    videoDialog.close();
  }
});
videoDialog.addEventListener("close", () => {
  fullVideo.pause();
  if (resumeBackground) {
    playBackground();
  }
  videoOpen.focus();
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  backgroundVideo.autoplay = false;
  backgroundVideo.pause();
} else {
  playBackground();
}

document.querySelector("#copy-account").addEventListener("click", async () => {
  const account = document.querySelector("#account-number");
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(account.dataset.account);
    status.textContent = "Número copiado: 4815163052145185";
  } catch (error) {
    console.error("No se pudo copiar el número de cuenta:", error);
    status.textContent = "No se pudo copiar automáticamente. Selecciona el número de la tarjeta y cópialo manualmente.";
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(account);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

document.querySelector("#calendar-download").addEventListener("click", () => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Al pensar en el fin//Congreso 2026//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:congreso-20261113@alpensarenelfin.local",
    `DTSTAMP:${timestamp}`,
    "DTSTART;VALUE=DATE:20261113",
    "DTEND;VALUE=DATE:20261115",
    "SUMMARY:Al pensar en el fin - Congreso 2026",
    "LOCATION:INP Príncipe de Paz\\, Calle Sánchez Magallanes No. 505\\,",
    "  Comalcalco\\, Tabasco",
    "DESCRIPTION:Respuestas bíblicas sobre la muerte\\, el sepulcro",
    "  y la eternidad. Conferencista: Pbro. Samuel Hernández Clemente.",
    " \\nViernes: 14:00 Recepción y Bienvenida. 19:40 Término",
    "  de Conferencias y Cena.\\nSábado: 08:30 Inicio de Actividades.",
    "  13:40 Término de Conferencias y Comida.\\nAgenda sujeta a cambios.",
    " \\nInformación e inscripción: WhatsApp 9331473040.",
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "congreso-al-pensar-en-el-fin.ics";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#calendar-status").textContent = "Archivo de calendario preparado. Ábrelo para guardar la fecha.";
});
