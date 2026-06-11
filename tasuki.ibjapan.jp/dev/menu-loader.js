(function () {
  function buildMenuHtml(basePrefix) {
    return `
      <div class="menu-shell">
        <button class="menu-toggle" type="button" aria-label="メニューを開く" aria-expanded="false">
          <span class="menu-toggle-bar"></span>
          <span class="menu-toggle-bar"></span>
          <span class="menu-toggle-bar"></span>
        </button>
        <nav class="nav" aria-label="ページナビゲーション">
          <a href="${basePrefix}effect/index.html">効果</a>
          <a href="${basePrefix}plan/index.html">料金プラン</a>
          <a href="${basePrefix}access/index.html">店舗・アクセス</a>
          <a href="${basePrefix}column/index.html">美・健康コラム</a>
          <a class="nav-cta" href="https://reserva.be/tasukistretch/reserve?mode=service_staff&search_evt_no=65eJwzNTYyMTUGAAREATc" target="_blank" rel="noopener noreferrer">初回体験申込み</a>
        </nav>
      </div>
    `;
  }

  function initMenuInteraction(mount) {
    const shell = mount.querySelector(".menu-shell");
    const toggle = mount.querySelector(".menu-toggle");
    const nav = mount.querySelector(".nav");
    if (!shell || !toggle || !nav) return;

    const closeMenu = () => {
      shell.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      shell.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      if (shell.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!shell.classList.contains("is-open")) return;
      if (!mount.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  async function loadSharedMenu() {
    const mount = document.getElementById("shared-menu");
    if (!mount) return;

    const src = mount.dataset.menuSrc || "partials/menu.html";
    const basePrefix = mount.dataset.basePrefix || "";

    try {
      const response = await fetch(src, { cache: "no-cache" });
      if (!response.ok) throw new Error("menu load failed");
      const html = await response.text();
      mount.innerHTML = html;

      mount.querySelectorAll("a[data-path]").forEach((a) => {
        const path = a.getAttribute("data-path") || "";
        a.setAttribute("href", basePrefix + path);
      });

      initMenuInteraction(mount);
    } catch (error) {
      console.warn("shared menu fallback", error);
      mount.innerHTML = buildMenuHtml(basePrefix);
      initMenuInteraction(mount);
    }
  }

  loadSharedMenu();
})();