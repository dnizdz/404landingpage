(function () {
  const { brand, projects, contact, theme } = window.CONFIG || {};

  const byId = (id) => document.getElementById(id);
  const normalizeUrl = (value) => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };
  const iconUrls = {
    email: "https://api.iconify.design/heroicons-solid:envelope.svg?color=%23e6f2ff",
    instagram: "https://api.iconify.design/simple-icons:instagram.svg?color=%23e6f2ff",
    threads: "https://api.iconify.design/simple-icons:threads.svg?color=%23e6f2ff"
  };
  const hexToRgb = (hex) => {
    if (!hex) return null;
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const num = parseInt(full, 16);
    if (Number.isNaN(num)) return null;
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  const brandName = byId("brandName");
  const brandLogo = byId("brandLogo");
  const favicon = byId("favicon");
  const brandNav = byId("brandNav");
  const langSwitch = byId("langSwitch");
  const menuToggle = byId("menuToggle");
  const hero = byId("hero");
  const about = byId("about");
  const projectsSection = byId("projects");
  const contactSection = byId("contact");
  const footer = byId("footer");

  if (!brand) {
    return;
  }

  if (theme?.font?.baseSize) {
    document.documentElement.style.setProperty("--base-font", theme.font.baseSize);
  }

  const colors = theme?.colors || {};
  if (colors.bg) document.documentElement.style.setProperty("--bg", colors.bg);
  if (colors.text) document.documentElement.style.setProperty("--text", colors.text);
  if (colors.muted) document.documentElement.style.setProperty("--muted", colors.muted);
  if (colors.card) document.documentElement.style.setProperty("--card", colors.card);
  if (colors.border) document.documentElement.style.setProperty("--border", colors.border);
  if (colors.accent) document.documentElement.style.setProperty("--accent", colors.accent);
  if (colors.accent2) document.documentElement.style.setProperty("--accent-2", colors.accent2);
  const shadowRgb = hexToRgb(colors.bg) || hexToRgb(colors.card);
  if (shadowRgb) document.documentElement.style.setProperty("--shadow-rgb", shadowRgb);

  if (brand.name) {
    document.title = brand.name;
  }

  if (brand.logo && brandLogo) {
    brandLogo.src = brand.logo;
    brandLogo.alt = `${brand.name || "Brand"} logo`;
  } else if (brandLogo) {
    brandLogo.remove();
  }

  if (brand.icon && favicon) {
    favicon.href = brand.icon;
  }

  brandName.textContent = brand.name || "";

  brandNav.innerHTML = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ]
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join("");

  const heroTitle = brand.name || "";
  const heroTagline = brand.tagline || "";
  const socialButtons = [
    { label: "Instagram", url: normalizeUrl(brand.instagram) },
    { label: "Threads", url: normalizeUrl(brand.threads) }
  ]
    .filter((item) => item.url)
    .map(
      (item) =>
        `<a class="btn" href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a>`
    )
    .join("");

  const focusIconColor = encodeURIComponent(colors.accent || "#26c6f5");
  const focusIcons = [
    { label: "Strategy", icon: "heroicons-outline:presentation-chart-line" },
    { label: "Technology", icon: "heroicons-outline:cpu-chip" },
    { label: "SOP", icon: "heroicons-outline:clipboard-document-list" },
    { label: "Delivery", icon: "heroicons-outline:rocket-launch" }
  ]
    .map(
      (item) =>
        `<div class="focus-item"><img class="focus-icon" src="https://api.iconify.design/${item.icon}.svg?color=${focusIconColor}" alt="" /><span>${item.label}</span></div>`
    )
    .join("");

  const descriptionId = brand.description || "";
  const descriptionEn = brand.descriptionEn || "";

  const setLanguage = (lang) => {
    document.body.dataset.lang = lang;
  };

  if (langSwitch) {
    const langButton = langSwitch.querySelector(".lang-pill");
    if (langButton) {
      langButton.addEventListener("click", () => {
        const current = document.body.dataset.lang || "id";
        setLanguage(current === "id" ? "en" : "id");
      });
    }
  }

  if (menuToggle && brandNav) {
    const setMenuState = (open) => {
      document.body.dataset.menuOpen = open ? "true" : "false";
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.dataset.menuOpen === "true";
      setMenuState(!isOpen);
    });

    brandNav.addEventListener("click", (event) => {
      if (event.target && event.target.tagName === "A") {
        setMenuState(false);
      }
    });

    setMenuState(false);
  }

  window.setLanguage = setLanguage;

  hero.innerHTML = `
    <div>
      <h1>${heroTitle}</h1>
      ${heroTagline ? `<h2 class="hero-tagline">${heroTagline}</h2>` : ""}
      <p data-lang="id">${descriptionId}</p>
      <p data-lang="en">${descriptionEn}</p>
      <div class="cta">${socialButtons}</div>
    </div>
    <div>
      <div class="section-title">Focus</div>
      <p class="section-body">${brand.tagline || ""}</p>
      <div class="focus-grid">${focusIcons}</div>
    </div>
  `;

  const aboutParagraphs = [
    descriptionId ? `<p class="section-body" data-lang="id">${descriptionId}</p>` : "",
    descriptionEn ? `<p class="section-body" data-lang="en">${descriptionEn}</p>` : ""
  ]
    .filter(Boolean)
    .join("");

  about.innerHTML = `
    <div class="section-title">About</div>
    ${aboutParagraphs}
  `;

  const projectCards = (projects || [])
    .filter((project) => project && (project.title || project.description))
    .map((project) => {
      const docs = (project.sampleDocs || [])
        .filter((doc) => doc && doc.name && doc.url)
        .map((doc) => {
          const docUrl = normalizeUrl(doc.url);
          return `<li><a href="${docUrl}" target="_blank" rel="noreferrer">${doc.name}</a></li>`;
        })
        .join("");

      const docList = docs
        ? `<ul class="project-docs">${docs}</ul>`
        : `<p class="section-body">No sample documents yet.</p>`;

      const actionButtons = [
        project.projectUrl
          ? `<a class="btn" href="${normalizeUrl(project.projectUrl)}" target="_blank" rel="noreferrer">View Project</a>`
          : "",
        project.folderUrl
          ? `<a class="btn secondary" href="${normalizeUrl(project.folderUrl)}" target="_blank" rel="noreferrer">Open Folder</a>`
          : ""
      ]
        .filter(Boolean)
        .join("");

      return `
        <article class="project-card">
          <h3 data-lang="id">${project.title || "Untitled Engagement"}</h3>
          ${project.titleEn ? `<h3 class="project-title-en" data-lang="en">${project.titleEn}</h3>` : ""}
          ${
            project.description
              ? `<p data-lang="id">${project.description}</p>`
              : ""
          }
          ${
            project.descriptionEn
              ? `<p data-lang="en">${project.descriptionEn}</p>`
              : ""
          }
          ${docList}
          <div class="project-actions">${actionButtons}</div>
        </article>
      `;
    })
    .join("");

  projectsSection.innerHTML = `
    <div class="section-title">Projects</div>
    <div class="projects-grid">
      ${projectCards || "<p class=\"section-body\">No projects added yet.</p>"}
    </div>
  `;

  const contactItems = [
    contact?.email
      ? `<div class="contact-card"><h4>Email</h4><a class="contact-link" href="mailto:${contact.email}"><img class="contact-logo" src="${iconUrls.email}" alt="Email icon" />${contact.email}</a></div>`
      : "",
    contact?.phone
      ? `<div class="contact-card"><h4>Phone</h4><a class="contact-link" href="tel:${contact.phone}">${contact.phone}</a></div>`
      : "",
    brand.instagram
      ? `<div class="contact-card"><h4>Instagram</h4><a class="contact-link" href="${normalizeUrl(brand.instagram)}" target="_blank" rel="noreferrer"><img class="contact-logo" src="${iconUrls.instagram}" alt="Instagram logo" />${brand.instagram}</a></div>`
      : "",
    brand.threads
      ? `<div class="contact-card"><h4>Threads</h4><a class="contact-link" href="${normalizeUrl(brand.threads)}" target="_blank" rel="noreferrer"><img class="contact-logo" src="${iconUrls.threads}" alt="Threads logo" />${brand.threads}</a></div>`
      : ""
  ]
    .filter(Boolean)
    .join("");

  contactSection.innerHTML = `
    <div class="section-title">Contact</div>
    <div class="contact-grid">${contactItems}</div>
  `;

  const year = new Date().getFullYear();
  footer.textContent = `© ${year} ${brand.name}. All rights reserved.`;

  setLanguage("id");
})();
