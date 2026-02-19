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

  const brandName = byId("brandName");
  const brandLogo = byId("brandLogo");
  const favicon = byId("favicon");
  const brandNav = byId("brandNav");
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

  const heroTitle = `${brand.name || ""} — ${brand.tagline || ""}`.trim();
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

  const focusIcons = [
    { label: "Strategy", icon: "📌" },
    { label: "Technology", icon: "🧩" },
    { label: "SOP", icon: "🗂️" },
    { label: "Delivery", icon: "⚙️" }
  ]
    .map(
      (item) =>
        `<div class="focus-item"><span class="focus-icon">${item.icon}</span><span>${item.label}</span></div>`
    )
    .join("");

  hero.innerHTML = `
    <div>
      <h1>${heroTitle}</h1>
      <p>${brand.description || ""}</p>
      <div class="cta">${socialButtons}</div>
    </div>
    <div>
      <div class="section-title">Focus</div>
      <p class="section-body">${brand.tagline || ""}</p>
      <div class="focus-grid">${focusIcons}</div>
    </div>
  `;

  about.innerHTML = `
    <div class="section-title">About</div>
    <p class="section-body">
      ${brand.description || ""}
    </p>
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
          <h3>${project.title || "Untitled Engagement"}</h3>
          <p>${project.description || ""}</p>
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
      ? `<div class="contact-card"><h4>Email</h4><a href="mailto:${contact.email}">${contact.email}</a></div>`
      : "",
    contact?.phone
      ? `<div class="contact-card"><h4>Phone</h4><a href="tel:${contact.phone}">${contact.phone}</a></div>`
      : "",
    brand.instagram
      ? `<div class="contact-card"><h4>Instagram</h4><a href="${normalizeUrl(brand.instagram)}" target="_blank" rel="noreferrer">${brand.instagram}</a></div>`
      : "",
    brand.threads
      ? `<div class="contact-card"><h4>Threads</h4><a href="${normalizeUrl(brand.threads)}" target="_blank" rel="noreferrer">${brand.threads}</a></div>`
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
})();
