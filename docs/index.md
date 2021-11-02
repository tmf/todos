# HTML

The biggest restriction with completely static websites is that there is no templating. This presents a couple of challenges:
- Cache busting: we need to use `?v=` query string cache busting, as our asset filenames are also static.
- Hashes for SRI and CSP: are commited manually, Chromium reports the correct hashes in the console.
- Pages: essentially we're not a SPA, each page has it's own HTML
- Translations: each language has it's own HTML page
