# Hexa Order — Project Context for Claude

## What This Is
A static GitHub Pages app (`satsivi.github.io`) that calls the MapleStory Scouter API to return the optimal HEXA skill level-up order for a given class, sorted by efficiency per Sol Erda Fragment.

---

## File Structure
```
hexa-order.html   — CSS + HTML skeleton only. No inline JS.
skill-data.js     — All static lookup tables (class names, skill names, mastery labels)
hexa-api.js       — All logic: fetch, render, tooltip, progress panel, cost calculator
worker.js         — Cloudflare Worker CORS proxy (deployed at sorryconversionpeople.satsivi-ow.workers.dev)
```

---

## API
**Endpoint:** `POST https://api.maplescouter.com/api/calc/hexa-order?class=<Korean class name>`  
**API Key:** `ff6a7ce0-c4ce-11ee-900c-df03c8ea0d4c` (public, already exposed in maplescouter.com frontend)  
**CORS:** Requests must come from `https://satsivi.github.io` — enforced in the Cloudflare Worker

### Response shape
```json
{
  "class_hexa": [
    ["Korean skill name", targetLevel, "/hexaskill/ClassName_N.png", solErda, frags, cumErda, cumFrags, effPerFrag, cumFD],
    ...
  ]
}
```
Array index meanings: `[0]` Korean name, `[1]` level to upgrade to, `[2]` image path, `[3]` Sol Erda cost, `[4]` fragment cost, `[5]` cumulative Erda, `[6]` cumulative frags, `[7]` efficiency per fragment, `[8]` cumulative final damage %

---

## Skill Naming — Image Key System
Skill names are looked up by **image filename**, not Korean name. Key format: `ClassName_ID`

### Image ID → Skill Type
| ID | Type |
|----|------|
| 1  | Origin |
| 2  | Mastery 1 |
| 3  | Enhancement 1 |
| 4  | Enhancement 2 |
| 5  | Enhancement 3 |
| 6  | Enhancement 4 |
| 7  | Mastery 2 |
| 8  | Mastery 3 |
| 9  | Mastery 4 |
| 10 | Ascent |

Example: `/hexaskill/Luminous_9.png` → key `Luminous_9` → `"HEXA Apocalypse"`

### Class name → image prefix mapping
The image prefix is the English class name with spaces/punctuation stripped:
- `"Arch Mage (I/L)"` → `ArchMageIL`
- `"Dark Knight"` → `DarkKnight`
- `"Dawn Warrior"` → `DawnWarrior`

`IMG_NAMES` in `skill-data.js` has ~470 entries covering all KMS classes.

### Not yet mapped (manual fixes pending)
Kanna, Hayato, Mo Xuan, Sia Astelle, Lynn

---

## Payload
Two base payloads in `hexa-api.js`:

| | Bossing Mule | End Game |
|---|---|---|
| Level | 260 | 293 |
| Server | Reboot | Reboot |
| Class used | Shade (은월) | Phantom (팬텀) |
| Purpose | Lv 260 liberated ~105m CP baseline | High-end stat baseline |

`myHexa` is always sent as all zeros (fresh start). `hexaStat` is `0` in both (not `3` — `3` means already levelled, which hides it from the results).

`cycle` (Origin Cycles) is injected at request time from the UI toggle (1–5).

User's current progress levels are injected via `applyProgressToPayload()` before sending.

---

## Current Progress Panel
Appears inside the config panel after selecting a class. Collapsible.

Layout:
- **Row 1 — Masteries:** M1 (ID 2), M2 (ID 7), M3 (ID 8), M4 (ID 9)
- **Row 2 — Enhancements:** Enh 1–4 (IDs 3–6) → map to `reinCore1-4` in payload
- **Row 3 — Origin & Ascent:** Origin (ID 1) → `skillCore1`, Ascent (ID 10) → `skillCore2`

**Origin is always minimum 1** — given free on 6th job. Level 1 is excluded from cost totals.

### Cost calculation (from MapleStory Wiki SolErdaCostTable)
```
solErdaCost  = [5,1,1,1,2,2,2,3,3,10,3,3,4,4,4,4,4,4,5,15,5,5,5,5,5,6,6,6,7,20]
fragmentCost = [100,30,35,40,45,50,55,60,65,200,80,90,100,110,120,130,140,150,160,350,170,180,190,200,210,220,230,240,250,500]
```
Multipliers (ceiling applied): Origin/Ascent = ×1.0, Mastery = ×0.5, Enhancement = ×0.75

---

## UI Notes
- **Tooltip:** Pure JS mouseover on `.ic` elements, fixed-position `#tip` div, no CSS `:hover`
- **Mastery labels:** IDs 2,7,8,9 get `M1:`–`M4:` prefix in tooltip title only
- **HEXA Stat** entries come from the Nexon CDN URL (`open.api.nexon.com`) — detected and labelled `"HEXA Stat"`
- **Test mode:** Type `test` in class search → renders Wild Hunter dummy payload without API call
- **Origin Cycles info tooltip:** Pure CSS, explains 1 cycle ≈ 5 min 40 sec

---

## Known Issues
- HEXA Stat recommendation is inaccurate for the Bossing Mule and End Game base configurations (noted in UI)
- `hexaStat` in payload must be `0` or the API assumes stat cores are already levelled and excludes them

---

## Cloudflare Worker
File: `worker.js`  
URL: `https://sorryconversionpeople.satsivi-ow.workers.dev`  
- Proxies POST requests to `api.maplescouter.com` with correct headers
- Blocks all origins except `https://satsivi.github.io`
- Uses service worker syntax (`addEventListener("fetch", ...)`)
