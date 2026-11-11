"use strict";

const hymnDialog = document.querySelector("#opening-hymn-dialog");
const hymnOpenButton = document.querySelector("#opening-hymn-open");
const defaultHymnFontSize = 1;
const minHymnFontSize = 0.9;
const maxHymnFontSize = 1.8;
const hymnFontSizeStep = 0.1;

function setupFontSizeControls(content, status, decreaseButton, increaseButton, resetButton) {
  let fontSize = defaultHymnFontSize;

  function updateFontSize(size) {
    fontSize = Math.round(Math.min(maxHymnFontSize, Math.max(minHymnFontSize, size)) * 10) / 10;
    content.style.setProperty("--opening-hymn-font-size", `${fontSize.toFixed(1)}rem`);
    status.textContent = fontSize === defaultHymnFontSize
      ? "Tamaño normal"
      : `${Math.round(fontSize / defaultHymnFontSize * 100)}% del tamaño normal`;
    decreaseButton.disabled = fontSize === minHymnFontSize;
    increaseButton.disabled = fontSize === maxHymnFontSize;
  }

  decreaseButton.addEventListener("click", () => updateFontSize(fontSize - hymnFontSizeStep));
  increaseButton.addEventListener("click", () => updateFontSize(fontSize + hymnFontSizeStep));
  resetButton.addEventListener("click", () => updateFontSize(defaultHymnFontSize));
  updateFontSize(defaultHymnFontSize);
}

hymnOpenButton.addEventListener("click", () => hymnDialog.showModal());
document.querySelector("#opening-hymn-close").addEventListener("click", () => hymnDialog.close());
setupFontSizeControls(
  hymnDialog.querySelector(".opening-hymn-lyrics"),
  document.querySelector("#opening-hymn-size-status"),
  document.querySelector("#opening-hymn-decrease"),
  document.querySelector("#opening-hymn-increase"),
  document.querySelector("#opening-hymn-reset")
);

const hymn60Dialog = document.querySelector("#opening-hymn-60-dialog");
document.querySelector("#opening-hymn-60-open").addEventListener("click", () => hymn60Dialog.showModal());
document.querySelector("#opening-hymn-60-close").addEventListener("click", () => hymn60Dialog.close());
setupFontSizeControls(
  hymn60Dialog.querySelector(".opening-hymn-lyrics"),
  document.querySelector("#opening-hymn-60-size-status"),
  document.querySelector("#opening-hymn-60-decrease"),
  document.querySelector("#opening-hymn-60-increase"),
  document.querySelector("#opening-hymn-60-reset")
);

const bibleDialog = document.querySelector("#opening-bible-dialog");
const bibleTitle = document.querySelector("#opening-bible-title");
const bibleText = document.querySelector("#opening-bible-text");
const bibleSource = document.querySelector("#opening-bible-source");
const biblePassages = {
  hebreos: {
    title: "Hebreos 9:27-28",
    text: "Y de la manera que está establecido para los hombres que mueran una sola vez, y después de esto el juicio, así también Cristo fue ofrecido una sola vez para llevar los pecados de muchos; y aparecerá por segunda vez, sin relación con el pecado, para salvar a los que le esperan.",
    url: "https://www.biblegateway.com/passage/?search=Hebreos%209%3A27-28&version=RVR1960"
  },
  apocalipsis: {
    title: "Apocalipsis 14:13",
    text: "Oí una voz que desde el cielo me decía: Escribe: Bienaventurados de aquí en adelante los muertos que mueren en el Señor. Sí, dice el Espíritu, descansarán de sus trabajos, porque sus obras con ellos siguen.",
    url: "https://www.biblegateway.com/passage/?search=Apocalipsis%2014&version=RVR1960"
  }
};

document.querySelectorAll("[data-bible-passage]").forEach((button) => {
  button.addEventListener("click", () => {
    const passage = biblePassages[button.dataset.biblePassage];
    bibleTitle.textContent = passage.title;
    bibleText.textContent = `“${passage.text}”`;
    bibleSource.href = passage.url;
    bibleDialog.showModal();
  });
});
document.querySelector("#opening-bible-close").addEventListener("click", () => bibleDialog.close());
setupFontSizeControls(
  bibleDialog.querySelector(".opening-bible-reading"),
  document.querySelector("#opening-bible-size-status"),
  document.querySelector("#opening-bible-decrease"),
  document.querySelector("#opening-bible-increase"),
  document.querySelector("#opening-bible-reset")
);
