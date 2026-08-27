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
    console.error("Couldn't copy email");
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
