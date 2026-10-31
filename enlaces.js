"use strict";

const shareButton = document.querySelector("#share-links");
const shareStatus = document.querySelector("#share-status");

shareButton.hidden = false;
shareButton.addEventListener("click", async () => {
  const url = new URL("enlaces.html", window.location.href).href;
  shareStatus.textContent = "";
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Al pensar en el fin - Congreso 2026",
        text: "Consulta la agenda, inscripción y ubicación del congreso.",
        url
      });
    } else {
      await navigator.clipboard.writeText(url);
      shareStatus.textContent = "Enlace copiado al portapapeles.";
    }
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    console.error("No se pudo compartir el enlace del congreso:", error);
    shareStatus.textContent = `No se pudo compartir automáticamente. Copia este enlace: ${url}`;
  }
});
