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

const projectResources = {
  vidaRosa: {
    repositories: [
      {
        nameKey: "projects.vidaRosa.repositories.userData",
        url: "https://github.com/gersonvidal/vidarosa-microservicio-user-data",
      },
      {
        nameKey: "projects.vidaRosa.repositories.selfExaminationFindings",
        url: "https://github.com/gersonvidal/vidarosa-microservicio-hallazgos",
      },
      {
        nameKey: "projects.vidaRosa.repositories.trivia",
        url: "https://github.com/gersonvidal/vidarosa-microservicio-preguntados",
      },
      {
        nameKey: "projects.vidaRosa.repositories.database",
        url: "https://github.com/gersonvidal/vidarosa-bd",
      },
      {
        nameKey: "projects.vidaRosa.repositories.deploymentConfigExample",
        url: "https://github.com/gersonvidal/vidarosa-config-deploy",
      },
    ],
  },

  criticalPath: {
    repositories: [
      {
        nameKey: "projects.criticalPath.repositories.backend",
        url: "https://github.com/gersonvidal/ProjectPath-Pro-Backend",
      },
      {
        nameKey: "projects.criticalPath.repositories.database",
        url: "https://github.com/gersonvidal/ProjectPath-Pro-Database",
      },
    ],
  },

  greenhouse: {
    repositories: [
      {
        nameKey: "projects.greenhouse.repositories.backend",
        url: "https://github.com/gersonvidal/simuladores-iot-fvh",
      },
    ],
  },

  garageManagement: {},
};

const projectCards = document.querySelectorAll(
  ".project-card[data-project-id]",
);

projectCards.forEach((card) => {
  const projectId = card.dataset.projectId;
  const projectData = projectResources[projectId] ?? {};

  const repositories = projectData.repositories ?? [];
  const media = projectData.media ?? [];

  const overlay = document.createElement("div");
  overlay.classList.add("repo-overlay");
  overlay.setAttribute("aria-hidden", "true");

  if (repositories.length > 0) {
    const repositoryTitle = document.createElement("h3");

    repositoryTitle.dataset.i18n =
      repositories.length === 1
        ? "repositories.singular"
        : "repositories.plural";

    const repositoryList = document.createElement("ul");

    repositoryList.classList.add("repo-list");

    repositories.forEach((repository) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      const repositoryName = document.createElement("span");

      link.href = repository.url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";

      repositoryName.dataset.i18n = repository.nameKey;

      link.appendChild(repositoryName);
      listItem.appendChild(link);
      repositoryList.appendChild(listItem);
    });

    overlay.appendChild(repositoryTitle);
    overlay.appendChild(repositoryList);
  } else {
    const privateRepositoryMessage = document.createElement("p");

    privateRepositoryMessage.dataset.i18n = "repositories.private";

    overlay.appendChild(privateRepositoryMessage);
  }

  if (media.length > 0) {
    const mediaTitle = document.createElement("h3");

    mediaTitle.dataset.i18n = "media.title";

    const mediaList = document.createElement("ul");

    mediaList.classList.add("repo-list");

    media.forEach((mediaItem) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      const mediaName = document.createElement("span");

      link.href = mediaItem.url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";

      mediaName.dataset.i18n = mediaItem.nameKey;

      link.appendChild(mediaName);
      listItem.appendChild(link);
      mediaList.appendChild(listItem);
    });

    overlay.appendChild(mediaTitle);
    overlay.appendChild(mediaList);
  }

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
