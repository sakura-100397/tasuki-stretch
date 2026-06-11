(function () {
  async function loadSharedFooter() {
    const mount = document.getElementById("shared-footer");
    if (!mount) return;

    const src = mount.dataset.footerSrc || "partials/footer.html";
    const basePrefix = mount.dataset.basePrefix || "";

    try {
      const response = await fetch(src, { cache: "no-cache" });
      if (!response.ok) throw new Error("footer load failed");
      const html = await response.text();
      mount.innerHTML = html;

      // パスを basePrefx に基づいて修正
      if (basePrefix) {
        const homeLink = mount.querySelector(".footer-brand");
        if (homeLink) {
          homeLink.setAttribute("href", basePrefix + "index.html");
        }
        const logoImg = mount.querySelector(".footer-brand img");
        if (logoImg) {
          logoImg.setAttribute("src", basePrefix + "images/tasuki-logo.png");
        }
      }
    } catch (error) {
      console.warn("shared footer fallback", error);
      // フォールバック用フッターHTML
      const fallbackFooter = document.createElement("footer");
      fallbackFooter.className = "site-footer";
      fallbackFooter.innerHTML = `
        <div class="footer-inner">
          <a class="footer-brand" href="${basePrefix}index.html">
            <img src="${basePrefix}images/tasuki-logo.png" alt="TASUKI STRETCH ロゴ" />
            <span>TASUKI STRETCH</span>
          </a>
          <span>© 2026 TASUKI STRETCH</span>
        </div>
      `;
      mount.appendChild(fallbackFooter);
    }
  }

  loadSharedFooter();
})();
