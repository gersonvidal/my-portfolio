const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "es"];
const LANGUAGE_STORAGE_KEY = "portfolio-language";

const appScriptUrl = new URL(document.currentScript.src);
const assetsBaseUrl = new URL("./", appScriptUrl);
const localesBaseUrl = new URL("locales/", assetsBaseUrl);

let currentLanguage = DEFAULT_LANGUAGE;
let currentTranslations = {};

const isDevelopment = ["localhost", "127.0.0.1"].includes(
  window.location.hostname,
);

async function loadTranslations(language) {
  const translationUrl = new URL(`${language}.json`, localesBaseUrl);

  const response = await fetch(translationUrl);

  if (!response.ok) {
    throw new Error(`Could not load translations for language: ${language}`);
  }

  return response.json();
}

function getTranslation(translations, key) {
  return key
    .split(".")
    .reduce(
      (currentObject, property) => currentObject?.[property],
      translations,
    );
}

function translatePage(translations) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translation = getTranslation(translations, key);

    if (translation !== undefined) {
      element.textContent = translation;
    } else if (isDevelopment) {
      console.warn(`Could not translate: ${key}`);
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    const translation = getTranslation(translations, key);

    if (translation !== undefined) {
      element.setAttribute("alt", translation);
    } else if (isDevelopment) {
      console.warn(`Could not translate alternative: ${key}`);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    const translation = getTranslation(translations, key);

    if (translation !== undefined) {
      element.setAttribute("aria-label", translation);
    } else if (isDevelopment) {
      console.warn(`Could not translate aria label: ${key}`);
    }
  });
}

function updateLanguageButtons(language) {
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === language;

    button.classList.toggle("is-active", isActive);

    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateCvDownload(language) {
  const downloadLinks = document.querySelectorAll("[data-cv-download]");

  const languageSuffix = language.toUpperCase();

  const fileName = `CV_Gerson_Vidal_Alcantara_${languageSuffix}.pdf`;

  const fileUrl = new URL(`cv/${fileName}`, assetsBaseUrl);

  downloadLinks.forEach((link) => {
    link.href = fileUrl.href;
    link.download = fileName;
  });
}

async function changeLanguage(language) {
  const validLanguage = SUPPORTED_LANGUAGES.includes(language)
    ? language
    : DEFAULT_LANGUAGE;

  try {
    const translations = await loadTranslations(validLanguage);

    currentLanguage = validLanguage;
    currentTranslations = translations;

    document.documentElement.lang = validLanguage;

    translatePage(translations);
    updateLanguageButtons(validLanguage);
    updateCvDownload(validLanguage);

    localStorage.setItem(LANGUAGE_STORAGE_KEY, validLanguage);
  } catch (error) {
    if (isDevelopment) {
      console.error("Could not change language", error.message);
    }
  }
}

function initializeLanguage() {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      changeLanguage(button.dataset.language);
    });
  });

  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  const initialLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage)
    ? savedLanguage
    : DEFAULT_LANGUAGE;

  changeLanguage(initialLanguage);
}

const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealElements = document.querySelectorAll("[data-reveal]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0 },
);

revealElements.forEach((element) => observer.observe(element));

const projectRepositories = {
  "vida-rosa": {
    "Microservicio User Data":
      "https://github.com/gersonvidal/vidarosa-microservicio-user-data",
    "Microservicio Hallazgos de autoexploración":
      "https://github.com/gersonvidal/vidarosa-microservicio-hallazgos",
    "Microservicio Trivia":
      "https://github.com/gersonvidal/vidarosa-microservicio-preguntados",
    "Base de Datos": "https://github.com/gersonvidal/vidarosa-bd",
    "Ejemplo para configuración de despliegue":
      "https://github.com/gersonvidal/vidarosa-config-deploy",
  },

  "critical-path-method": {
    Backend: "https://github.com/gersonvidal/ProjectPath-Pro-Backend",
    Database: "https://github.com/gersonvidal/ProjectPath-Pro-Database",
  },

  "greenhouse-iot": {
    Backend: "https://github.com/gersonvidal/simuladores-iot-fvh",
  },

  "auto-repair-management": {},
};

const projectCards = document.querySelectorAll(
  ".project-card[data-project-id]",
);

projectCards.forEach((card) => {
  const projectId = card.dataset.projectId;
  const repositories = projectRepositories[projectId] ?? {};
  const repositoryEntries = Object.entries(repositories);

  const overlay = document.createElement("div");
  overlay.classList.add("repo-overlay");
  overlay.setAttribute("aria-hidden", "true");

  const title = document.createElement("h3");

  title.textContent =
    repositoryEntries.length > 1 ? "Repositorios" : "Repositorio";

  const list = document.createElement("ul");
  list.classList.add("repo-list");

  if (repositoryEntries.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "No disponible";
    list.appendChild(listItem);
  } else {
    repositoryEntries.forEach(([repositoryName, repositoryUrl]) => {
      const listItem = document.createElement("li");

      const link = document.createElement("a");

      link.href = repositoryUrl;
      link.textContent = repositoryName;
      link.target = "_blank";
      link.rel = "noreferrer noopener";

      listItem.appendChild(link);
      list.appendChild(listItem);
    });
  }

  overlay.appendChild(title);
  overlay.appendChild(list);
  card.appendChild(overlay);

  const toggleRepositories = () => {
    const isOpen = card.classList.toggle("is-repo-open");

    card.setAttribute("aria-expanded", String(isOpen));
    overlay.setAttribute("aria-hidden", String(!isOpen));
  };

  card.addEventListener("click", (event) => {
    if (event.target.closest(".repo-overlay a")) {
      return;
    }

    toggleRepositories();
  });

  card.addEventListener("keydown", (event) => {
    if (event.target.closest("a")) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRepositories();
    }
  });
});

const contactModal = document.querySelector("#contact-modal");

const openContactButtons = document.querySelectorAll(".open-contact-modal");

const closeContactButton = document.querySelector("#close-contact-modal");

const copyContactButton = document.querySelector("#copy-contact-email");

const copyContactMessage = document.querySelector("#contact-copy-message");

const contactEmail = "ws.gersonvidal@gmail.com";

function openContactModal() {
  contactModal.showModal();
}

function closeContactModal() {
  contactModal.close();
}

async function copyContactEmail() {
  try {
    await navigator.clipboard.writeText(contactEmail);

    showCopyMessage();
  } catch (error) {
    if (isDevelopment) {
      console.error("Couldn't copy email", error.message);
    }
  }
}

function showCopyMessage() {
  copyContactMessage.classList.add("is-visible");

  setTimeout(() => {
    copyContactMessage.classList.remove("is-visible");
  }, 2500);
}

openContactButtons.forEach((button) => {
  button.addEventListener("click", openContactModal);
});

closeContactButton.addEventListener("click", closeContactModal);

copyContactButton.addEventListener("click", copyContactEmail);

contactModal.addEventListener("click", (event) => {
  if (event.target === contactModal) {
    closeContactModal();
  }
});

contactModal.addEventListener("close", () => {
  copyContactMessage.classList.remove("is-visible");
});

initializeLanguage();
