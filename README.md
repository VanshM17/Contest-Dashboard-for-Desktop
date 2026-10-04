# ContestRadar - CP Contest Dashboard

A live desktop wallpaper that shows upcoming competitive programming contests from **Codeforces, LeetCode, CodeChef and AtCoder** in one glass-style panel. Built with plain HTML, CSS and JavaScript, with no frameworks and no build step, and meant to run through [Lively Wallpaper](https://github.com/rocksdanister/lively).
<img width="1672" height="941" alt="Minimal Desktop with Contest Dashboard" src="https://github.com/user-attachments/assets/6ad7d079-0dae-4a05-a8e5-60ba2d4957ab" />


## Features

- Pulls upcoming contests from four platforms and merges them into a single list sorted by start time
- Shows the next 9 contests as color-coded cards (one color per platform)
- Marks contests that are currently running with a pulsing **LIVE** badge
- Filters Codeforces contests by your rating, so Div. 1 rounds only show up if you are rated 1900 or above
- Shows only AtCoder Beginner, Regular and Grand Contests
- Refreshes automatically every hour
- Hover a card to enlarge it, and click it to open the contest page
- Escapes contest titles before rendering them

## Requirements

| Requirement | Notes |
|---|---|
| **Windows 10 or 11** | Lively Wallpaper is Windows-only |
| **[Lively Wallpaper](https://github.com/rocksdanister/lively)** | Free and open source. Available from the Microsoft Store or GitHub releases |
| **Internet connection** | Contest data is fetched live from public APIs (see [Data sources](#data-sources)) |

Without Lively, you can still preview the dashboard by opening `index.html` in any modern browser.

## Project structure

```
cp-contest-dashboard/
├── index.html   # markup
├── style.css    # styling
└── script.js    # data fetching, filtering and rendering
└── image.png    # an example image for how the project would look on desktop

```

Keep all three files in the same folder, because `index.html` loads the other two by relative path.

## Setting it up in Lively

1. Install Lively Wallpaper and open it from the system tray or from the desktop shortcut.
   
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a9d00c12-70f9-44ae-be07-c28fac9d2f4a" />

2. Click **Add Wallpaper** (the **+** button), or drag and drop `index.html` into the Lively window.
   
   <img width="672" height="727" alt="image" src="https://github.com/user-attachments/assets/46b1a220-7bec-4476-bca0-fbbcd73ee79e" />

3. Lively imports it as a web wallpaper. Select it in your library to apply it.
5. Check that the cards load. If the page looks unstyled or stays on "Loading schedule...", Lively probably imported only `index.html` without `style.css` and `script.js`. In that case, use the packaging method below.

### Packaging as a Lively zip (if the files don't load)

Lively can import a whole project as a `.zip` that contains a `LivelyInfo.json` in its root.

1. Add a `LivelyInfo.json` next to the three files:

   ```json
   {
     "AppVersion": "2.0.0.0",
     "Title": "CP Contest Dashboard",
     "Desc": "Upcoming Codeforces, LeetCode, CodeChef and AtCoder contests",
     "Author": "Vansh",
     "Type": 1,
     "FileName": "index.html"
   }
   ```

2. Zip the folder contents so that `LivelyInfo.json` is at the root of the archive, not inside a subfolder.
3. Drag and drop the `.zip` into the Lively window.

### Mouse input

Hover effects and click-to-open need mouse input to reach the wallpaper. Lively enables mouse input by default. If hover and click aren't working, check **Settings → Wallpaper → Interaction** in Lively.

### Updating after you edit files

Lively copies an imported wallpaper into its own library, so edits to your original files don't show up automatically. After changing the code, delete the wallpaper from the Lively library and import it again.

## Configuration

Everything lives in `script.js` and `style.css`.

| What | Where | Default |
|---|---|---|
| Your Codeforces handle (used for rating-based filtering) | `CF_HANDLE` in `script.js` | `vanshmaheshwari` |
| Rating cutoff for Div. 1 contests | `isEligibleContest()` in `script.js` | 1900 |
| Which AtCoder contests to show | regex in `fetchAtCoder()` | Beginner, Regular, Grand |
| Number of cards shown | `.slice(0, 9)` in `fetchAllContests()` | 9 |
| Refresh interval | `setInterval(...)` at the bottom of `script.js` | 1 hour |
| Platform colors | `--cf`, `--lc`, `--ac`, `--cc` in `style.css` | blue, orange, green, purple |
| Panel size and scale | `.overlay` (`width`, `zoom`) in `style.css` | 960px at 0.68 zoom |
| Panel position | `.wallpaper-container` in `style.css` | right-aligned, 50px padding |

If the panel looks too big, too small or badly placed on your screen, adjust `zoom` on `.overlay` and the `padding-right` on `.wallpaper-container` first.

## Data sources

| Platform | Source |
|---|---|
| Codeforces | [Official Codeforces API](https://codeforces.com/apis) (`contest.list`, `user.info`) |
| LeetCode and CodeChef | [competeapi.vercel.app](https://competeapi.vercel.app/contests/upcoming/), a community API |
| AtCoder | [Contest Hive](https://contest-hive.vercel.app/api/atcoder), a community API (AtCoder has no official API) |

The LeetCode, CodeChef and AtCoder feeds are community-run, so they can go down or change without notice. If one platform's cards stop showing up, check its endpoint first.

## Troubleshooting

- **"Loading schedule..." never goes away.** Check your internet connection, then open the page in a browser and look at the developer console for failed requests.
- **Missing platform.** If a community API is down, that platform's cards won't appear. The others keep working.
- **No Div. 1 contests.** This is expected if your rating is below 1900. Change the cutoff in `isEligibleContest()`.
- **Wallpaper disappears or stops loading after a fullscreen app.** This is a known Lively quirk with web wallpapers. Remove and re-add the wallpaper.
- **Changes don't show up.** See [Updating after you edit files](#updating-after-you-edit-files).

## Tech stack

HTML5, CSS3 (custom properties, `color-mix()`, `backdrop-filter`) and vanilla JavaScript (`fetch`, `async/await`).

## Acknowledgements

- [Lively Wallpaper](https://github.com/rocksdanister/lively) by rocksdanister
- Codeforces, LeetCode, CodeChef and AtCoder for the contests
- Contest Hive and CompeteAPI for the community data feeds
