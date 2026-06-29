(function () {
  function loadStickyCta() {
    if (document.getElementById("sticky-cta-button")) return;

    const button = document.createElement("a");
    button.id = "sticky-cta-button";
    button.className = "sticky-cta-button";
    button.href = "https://reserva.be/tasukistretch/reserve?mode=service_staff&search_evt_no=13eJwzNTa3MDIHAARiAUE";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "無料体験申込みページへ移動（新しいウィンドウで開く）");
    button.textContent = "無料体験申込み";

    document.body.appendChild(button);
  }

  async function loadSharedFooter() {
    const mount = document.getElementById("shared-footer");
    if (!mount) {
      loadStickyCta();
      return;
    }

    const src = mount.dataset.footerSrc || "partials/footer.html";
    const basePrefix = mount.dataset.basePrefix || "";

    try {
      const response = await fetch(src, { cache: "no-cache" });
      if (!response.ok) throw new Error("footer load failed");
      const html = await response.text();
      mount.innerHTML = html;

      // フッター内リンクを basePrefix に基づいて修正
      const links = mount.querySelectorAll("a[href]");
      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
        link.setAttribute("href", basePrefix + href);
      });

      const logoImg = mount.querySelector(".footer-brand img");
      if (logoImg) {
        const src = logoImg.getAttribute("src") || "";
        if (src && !src.startsWith("http")) {
          logoImg.setAttribute("src", basePrefix + src);
        }
      }
    } catch (error) {
      console.warn("shared footer fallback", error);
      // フォールバック用フッターHTML
      const fallbackFooter = document.createElement("footer");
      fallbackFooter.className = "site-footer";
      fallbackFooter.innerHTML = `
        <div class="footer-inner">
          <a class="footer-brand" href="${basePrefix}index.html" aria-label="TASUKI STRETCH トップページ">
            <img src="${basePrefix}images/tasuki-logo.png" alt="TASUKI STRETCH ロゴ" />
            <span class="brand-copy">
              <span class="brand-name">TASUKI STRETCH</span>
              <span class="brand-subtitle">タスキ ストレッチ</span>
            </span>
          </a>
          <div class="footer-main">
            <nav class="footer-sitemap" aria-label="サイトマップ">
              <h2 class="footer-block-title">SITE MAP</h2>
              <ul class="footer-links">
                <li><a href="${basePrefix}effect/index.html">効果</a></li>
                <li><a href="${basePrefix}column/index.html">美・健康コラム</a></li>
                <li><a href="${basePrefix}plan/index.html">料金プラン</a></li>
                <li><a href="${basePrefix}access/index.html">店舗・アクセス</a></li>
                <li><a href="https://lin.ee/ys3Z9mR" target="_blank" rel="noopener noreferrer">問合せ</a></li>
              </ul>
            </nav>
            <section class="footer-company" aria-label="運営会社情報">
              <h2 class="footer-block-title">運営会社</h2>
              <dl class="company-list">
                <div><dt>会社名</dt><dd>株式会社IBJ</dd></div>
                <div><dt>設立</dt><dd>2006年2月</dd></div>
                <div><dt>所在地</dt><dd>〒160-0023 東京都新宿区西新宿1-23-7 新宿ファーストウエスト 12F・17F</dd></div>
                <div><dt>上場市場</dt><dd>東京証券取引所 プライム市場（証券コード6071）</dd></div>
                <div><dt>公式サイト</dt><dd><a href="https://www.ibjapan.jp/" target="_blank" rel="noopener noreferrer">https://www.ibjapan.jp/</a></dd></div>
              </dl>
            </section>
          </div>
          <div class="footer-bottom">
            <span>© IBJ Inc.All rights reserved.</span>
          </div>
        </div>
      `;
      mount.appendChild(fallbackFooter);
    }

    loadStickyCta();
  }

  loadSharedFooter();
})();
