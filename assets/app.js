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
  "vida-rosa": {},

  "critical-path-method": {
    Backend: "https://github.com/gersonvidal/ProjectPath-Pro-Backend",
    Database: "https://github.com/gersonvidal/ProjectPath-Pro-Database",
  },

  "greenhouse-iot": {
    Backend: "https://github.com/gersonvidal/simuladores-iot-fvh",
  },

  "disease-detection": {},
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
