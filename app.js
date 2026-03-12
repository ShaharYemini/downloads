/**
 * app.js — Downloads Site
 * Works on both index.html (grid) and download.html (detail).
 *
 * GitHub repo structure expected:
 *   <DOWNLOADS_FOLDER>/
 *     <subfolder-name>/
 *       <any-file>          ← the downloadable file
 *       description.txt     ← one-liner description shown in the card
 */

(function () {
  "use strict";

  /* ═══════════════════════════════════════════
     הגדרות — ערוך כאן בלבד (קובץ יחיד!)
     ═══════════════════════════════════════════ */
  const USER    = "ShaharYemini";                        // ← שם המשתמש ב-GitHub
  const REPO    = "downloads";                           // ← שם הריפוזיטורי
  const FOLDER  = "downloads";                           // ← תיקיית ההורדות
  const TITLE   = "הורדות";                     // ← כותרת האתר
  const TAGLINE = "כלים שנבנו בקפידה, מוכנים להורדה."; // ← תת-כותרת

  const RAW_BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;
  const API_BASE = `https://api.github.com/repos/${USER}/${REPO}/contents`;
  const GH_URL   = `https://github.com/${USER}/${REPO}`;

  /* ─── Shared DOM helpers ─── */
  function $(id) { return document.getElementById(id); }
  function show(el) { el && el.classList.remove("hidden"); }
  function hide(el) { el && el.classList.add("hidden"); }

  /* ─── Apply shared branding ─── */
  function applyBranding() {
    document.title = isDetailPage()
      ? `הורדה — ${TITLE}`
      : `${TITLE} — הורדות`;

    const titleEl = $("site-title");
    if (titleEl && !isDetailPage()) titleEl.textContent = TITLE;

    const ghLink = $("gh-link");
    if (ghLink) ghLink.href = GH_URL;

    const footerGh = $("footer-gh");
    if (footerGh) footerGh.href = GH_URL;

    const yearEl = $("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const footerCopy = $("footer-copy");
    if (footerCopy) {
      footerCopy.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${TITLE}`;
    }
  }

  function isDetailPage() {
    return window.location.pathname.includes("download.html");
  }

  /* ─── Fetch wrapper with error handling ─── */
  async function fetchJSON(url) {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${res.url}`);
    return res.json();
  }

  /* ─── Format bytes ─── */
  function formatBytes(bytes) {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /* ─── Infer file extension tag ─── */
  function fileExt(name) {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
  }

  /* ══════════════════════════════════════════════
     INDEX PAGE  —  grid of cards
  ══════════════════════════════════════════════ */
  async function initIndex() {
    applyBranding();

    $("hero-title").textContent = TITLE;
    $("hero-sub").textContent   = TAGLINE;

    const grid    = $("grid");
    const loading = $("loading");
    const empty   = $("empty");

    try {
      /* 1. List subfolders inside the downloads folder */
      const entries = await fetchJSON(`${API_BASE}/${FOLDER}`);
      const folders = entries.filter(e => e.type === "dir");

      if (folders.length === 0) {
        hide(loading);
        show(empty);
        return;
      }

      /* 2. For each subfolder, fetch its contents to find the file + description */
      const items = await Promise.all(
        folders.map(async folder => {
          try {
            const contents = await fetchJSON(`${API_BASE}/${FOLDER}/${folder.name}`);
            const descFile = contents.find(f =>
              f.type === "file" && f.name.toLowerCase() === "description.txt"
            );
            const downloadFile = contents.find(f =>
              f.type === "file" && f.name.toLowerCase() !== "description.txt"
            );

            let description = "";
            let repoUrl = "";
            if (descFile) {
              const raw = await fetch(descFile.download_url);
              const lines = (await raw.text()).trim().split("\n");
              description = lines[0].trim();
              /* שורה שנייה אופציונאלית — קישור לריפוזיטורי */
              const secondLine = (lines[1] || "").trim();
              if (secondLine.startsWith("http")) repoUrl = secondLine;
            }

            return {
              name:     folder.name,
              desc:     description || "אין תיאור זמין.",
              repoUrl,
              file:     downloadFile ? downloadFile.name : null,
              fileSize: downloadFile ? downloadFile.size : null,
            };
          } catch {
            return {
              name: folder.name,
              desc: "לא ניתן לטעון פרטים.",
              file: null,
              fileSize: null,
            };
          }
        })
      );

      hide(loading);

      /* 3. Render cards */
      items.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.animationDelay = `${0.05 * i}s`;
        card.innerHTML = `
          <div class="card-top">
            <span class="card-name">${escapeHtml(item.name)}</span>
            <span class="card-arrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"/>
              </svg>
            </span>
          </div>
          <p class="card-desc">${escapeHtml(item.desc)}</p>
          <div class="card-footer">
            ${item.file ? `<span class="card-tag">${fileExt(item.file)} · ${formatBytes(item.fileSize)}</span>` : ""}
            ${item.repoUrl ? `<a class="card-repo-link" href="${escapeHtml(item.repoUrl)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              קוד מקור
            </a>` : ""}
          </div>
        `;

        card.addEventListener("click", () => {
          const params = new URLSearchParams({
            folder:  item.name,
            file:    item.file || "",
            desc:    item.desc,
            repoUrl: item.repoUrl || "",
          });
          window.location.href = `download.html?${params.toString()}`;
        });

        grid.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      hide(loading);
      show(empty);
      empty.querySelector("span").textContent = "טעינת ההורדות נכשלה.";
      empty.querySelector("p").textContent = err.message;
    }
  }

  /* ══════════════════════════════════════════════
     DETAIL PAGE  —  single download
  ══════════════════════════════════════════════ */
  async function initDetail() {
    applyBranding();

    const params  = new URLSearchParams(window.location.search);
    const folder  = params.get("folder");
    const fileName= params.get("file");
    const desc    = params.get("desc");
    const repoUrl  = params.get("repoUrl") || "";

    const loading = $("loading");
    const content = $("detail-content");
    const errorEl = $("error-state");

    if (!folder) {
      hide(loading);
      show(errorEl);
      $("error-msg").textContent = "לא צוינה הורדה. נסה לחזור ולבחור קובץ.";
      return;
    }

    try {
      /* If filename was passed via query param, use it directly.
         Otherwise re-fetch the folder contents to discover it. */
      let resolvedFile = fileName;
      let fileSize = null;

      if (!resolvedFile) {
        const contents = await fetchJSON(`${API_BASE}/${FOLDER}/${folder}`);
        const downloadFile = contents.find(f =>
          f.type === "file" && f.name.toLowerCase() !== "description.txt"
        );
        if (!downloadFile) throw new Error("לא נמצא קובץ להורדה בתיקייה זו.");
        resolvedFile = downloadFile.name;
        fileSize = downloadFile.size;
      } else {
        /* Optionally get exact size from API */
        try {
          const contents = await fetchJSON(`${API_BASE}/${FOLDER}/${folder}`);
          const match = contents.find(f => f.name === resolvedFile);
          if (match) fileSize = match.size;
        } catch { /* non-critical */ }
      }

      const rawUrl = `${RAW_BASE}/${FOLDER}/${folder}/${resolvedFile}`;
      const ghFileUrl = `${GH_URL}/blob/main/${FOLDER}/${folder}/${resolvedFile}`;

      /* Update page title */
      document.title = `${folder} — ${TITLE}`;

      $("detail-name").textContent = folder;
      $("detail-desc").textContent = desc || "אין תיאור זמין.";
      $("file-name").textContent   = resolvedFile;
      $("file-size").textContent   = fileSize ? formatBytes(fileSize) : "גודל לא ידוע";

      const btn = $("download-btn");
      btn.href     = rawUrl;
      btn.download = resolvedFile;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        הורד את ${resolvedFile}
      `;

      const rawLink = $("raw-link");
      rawLink.href = ghFileUrl;
      rawLink.textContent = "צפייה בקובץ הגולמי ב-GitHub ←";

      /* כפתור קוד מקור — מוצג רק אם סופק קישור */
      const repoLinkEl = $("repo-source-link");
      if (repoLinkEl) {
        if (repoUrl) {
          repoLinkEl.href = repoUrl;
          repoLinkEl.classList.remove("hidden");
        } else {
          repoLinkEl.classList.add("hidden");
        }
      }

      hide(loading);
      show(content);

    } catch (err) {
      console.error(err);
      hide(loading);
      show(errorEl);
      $("error-msg").textContent = err.message;
    }
  }

  /* ─── Escape HTML to avoid XSS from filenames/descriptions ─── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ─── Router ─── */
  if (isDetailPage()) {
    initDetail();
  } else {
    initIndex();
  }

})();