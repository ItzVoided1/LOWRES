# LOWRES

A Y2K / grunge browser-game hub.

## What's included

- Grainy black / burgundy / dark-purple UI
- Search + category filters
- 320 catalog slots
- Verified playable mini-games included in the repo
- GitHub Actions catalog updater every 6 hours
- Strict source/permission metadata for imported games
- GitHub Pages-friendly static setup

## Important source rule

LOWRES does **not** scrape, copy, mirror, or rehost games from third-party game sites unless you have permission to use their content or they provide an authorized feed/API/license allowing it.

To add an authorized feed, edit `sources.json` and enable a JSON source whose records include:

```json
{
  "title": "Example Game",
  "category": "Arcade",
  "description": "Short description",
  "playUrl": "https://example.com/game/",
  "tags": ["arcade"],
  "license": "MIT"
}
```

The updater rejects entries without a playable URL or license metadata.

## GitHub Pages

Repository settings → Pages → Deploy from branch → `main` / `/ (root)`.

## Files

- `index.html` — hub
- `style.css` — LOWRES visual system
- `app.js` — catalog UI
- `games.json` — game registry
- `play.html` — built-in mini-game shell
- `sources.json` — authorized feed configuration
- `scripts/update_games.py` — scheduled importer
- `.github/workflows/update-games.yml` — automatic sync
