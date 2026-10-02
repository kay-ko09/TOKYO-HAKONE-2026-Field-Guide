# TOKYO / HAKONE 2026 Field Guide — v17.1

## What changed
- Film tools are now fully separated from the main travel guide.
- Removed the dark Film Counter block from `index.html`.
- Removed standalone film-restock cards from Day 2 / Day 3 / Day 4 to keep itinerary pages cleaner.
- Added a compact `FILM LOG` link in the top date navigation.
- `film-log.html` is now the dedicated film utility page with:
  - persistent film inventory counter
  - restock plan for 10/24, 10/25, 10/26
  - editable roll metadata
  - 36/37/38 individual frame notes
  - auto save in localStorage
  - JSON export/import backup
- Lemon-sha remains in the 10/26 itinerary because it is also an actual used-camera stop.

## Upload to GitHub
Upload the complete contents of this ZIP to the repository root, including `film-log.html`, `film-log.css`, `film-log.js`, and `assets/`.


## v17.2
- Added independent Trip Wallet page (wallet.html).
- JPY/TWD conversion, categories, payer, place/item, daily/trip totals, local auto-save and JSON backup.
- Main page stays clean with compact ¥ / WALLET navigation entry.


## v17.3
- 餐廳／咖啡卡新增 `¥ 記帳`。
- 點擊後開啟 Wallet 並自動帶入日期、分類、店家與預設品項，只需輸入金額。
- 新增成功後 URL 參數會清掉，避免重新整理重複帶入。
