# Projects Site

אתר פרויקטים אוטומטי המופעל ע"י GitHub API.  
ללא שלב build. ללא קובץ config נפרד. הוסף תיקייה — הכרטיס מופיע מיד.

---

## התקנה

### 1. העתק את קבצי האתר לשורש הריפוזיטורי

```
your-repo/
├── index.html
├── download.html
├── style.css
├── app.js
└── items/
    ├── My Tool/
    │   ├── my-tool.zip
    │   ├── preview.png        ← אופציונאלי
    │   └── description.txt
    └── My Website/
        ├── preview.jpg        ← אופציונאלי
        └── description.txt
```

### 2. ערוך את ה-config ב-`app.js`

```js
const USER     = "your-username";
const REPO     = "your-repo-name";
const FOLDER   = "items";
const TITLE    = "שם הפרויקט שלך";
const TAGLINE  = "פרויקטים שנבנו בקפידה.";
const EMAIL    = "your@email.com";   // השאר ריק להסתרה
```

### 3. הפעל GitHub Pages

**Settings → Pages** → Source: `main` branch, `/root` → Save.

---

## פורמט description.txt

### כרטיס הורדה (ברירת מחדל)

```
תיאור קצר של הכלי
https://github.com/user/repo    ← אופציונאלי — קישור קוד מקור
download                         ← אופציונאלי (ברירת מחדל)
https://example.com/img.png     ← אופציונאלי — URL לתמונה*
כיתוב לתמונה                    ← אופציונאלי
```

### כרטיס אתר (type=web)

```
תיאור האתר
https://mywebsite.com           ← כתובת האתר (כפתור "בקר באתר")
web                              ← חובה לציין
https://example.com/preview.png ← אופציונאלי — URL לתמונה*
כיתוב לתמונה                    ← אופציונאלי
```

> **תמונת Preview:** העדיפות הראשונה היא קובץ `preview.png` (או `.jpg/.webp/.gif`) בתוך תיקיית הפרויקט. לחלופין, ניתן לספק URL בשורה 4 של `description.txt`. לכרטיס אתר — אין צורך בקובץ הורדה בתיקייה.

---

## מה נטען אוטומטית מה-GitHub API

- גודל קובץ ההורדה
- תאריך העדכון האחרון (מ-git commits)

---

## Rate limits

בקשות ללא אימות: **60/שעה לכל IP**.  
לאתר פורטפוליו אישי זה מספיק בהחלט.
