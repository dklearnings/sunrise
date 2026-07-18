# Sunrise Valley Public School — website

A configurable, responsive school website. All content — school name,
contact details, nav links, notices, programs, infrastructure, gallery
captions, colors, and the two external portal links — lives in a single
physical file: **`public/config.json`**. Nothing else needs to change to
re-skin this site for a different school.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

`npm run build` produces a static `dist/` folder you can deploy anywhere
(Netlify, Vercel, GitHub Pages, a school's existing web host, etc).
`config.json` ships inside `dist/` too, and can still be edited after
build without recompiling — it's fetched at runtime, not bundled in.

## Editing content

Open `public/config.json` in any text editor. Everything on the page —
copy, notices, stats, programs, infrastructure cards, gallery labels,
footer links, and the color palette — is read from this file at runtime
via `fetch("/config.json")` in `src/App.jsx`. Save the file and refresh
the browser; no rebuild is required in dev mode.

Icon names in `config.json` (e.g. `"icon": "Library"`) must match one of
the keys in the `ICONS` map near the top of `src/App.jsx`. Add more
`lucide-react` icons to that map if you need new ones.

## Payments and admissions (external applications)

This site does not process payments or applications itself. It links out
to two assumed external applications, configured in `config.json` under
`"payments"`:

- `feePaymentUrl` — opens the school's fee-payment application in a new
  tab (linked from the top bar, header, footer, and contact section).
- `onlineAdmissionUrl` — opens the school's admissions application in a
  new tab (linked from the "Start application" button).

Replace both URLs with your real payment gateway / admissions system
addresses.

## Structure

```
public/config.json   ← all editable content (the "physical" config file)
src/App.jsx           ← layout, components, and styling — reads config.json
src/main.jsx          ← React entry point
index.html             ← HTML shell
```
