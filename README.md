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
└── downloads/
    ├── My Tool/
    │   ├── my-tool.zip
    │   └── description.txt
    └── My Website/
        └── description.txt
```

### 2. ערוך את ה-config ב-`app.js`

```js
const USER     = "your-username";
const REPO     = "your-repo-name";
const FOLDER   = "downloads";
const TITLE    = "שם הפרויקט שלך";
const TAGLINE  = "פרויקטים שנבנו בקפידה.";
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
https://example.com/img.png     ← אופציונאלי — תמונת preview
כיתוב לתמונה                    ← אופציונאלי
```

### כרטיס אתר (type=web)

```
תיאור האתר
https://mywebsite.com           ← כתובת האתר (כפתור "בקר באתר")
web                              ← חובה לציין
https://example.com/preview.png ← אופציונאלי — תמונת preview
כיתוב לתמונה                    ← אופציונאלי
```

לכרטיס אתר — אין צורך בקובץ להורדה בתיקייה.

---

## מה נטען אוטומטית מה-GitHub API

- גודל קובץ ההורדה
- תאריך העדכון האחרון (מ-git commits)

---

## Rate limits

בקשות ללא אימות: **60/שעה לכל IP**.  
לאתר פורטפוליו אישי זה מספיק בהחלט.
