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


## v17.4
- Restored 喫茶 nanashian / 白鳥の湖プリン to 10/27 between RistoPizza and teamLab.
- Added one-tap Wallet entry for the pudding.
- Corrected reservation note: dessert-only visits are walk-in; online reservation is for brunch set only.


## v17.5 itinerary refresh
- 10/26: RAFLUM + Lemon-sha moved between KAGEMARU sessions; Tsujita conditional; Jiichiro pudding keep; BUTTER keep; garage TOKYO removed; NACT target 14:00-14:15.
- 10/26 late-night ramen backups: Kaijin (early only), Manrai, Hayashida, Nagi, Ichiran last resort.
- 10/27: nanashian Swan Lake pudding removed; Azabudai buffer restored; late-night ramen backups AFURI Roppongi, Azabu Ramen, Ichiran Shimbashi.
- Hotel-dependent routes marked TBA where edited.

v17.6: Added Yurakucho Marui venue recognition image beside KAGEMARU key visual, mobile crop, venue address and MAP button.


## v17.6.1
- Re-cropped the Yurakucho Marui source image to a 1:1 mobile recognition crop focusing on the OIOI facade and entrance.
- Physically resized the venue image to 640x640 WebP (~50KB) instead of loading the full 1370x2048 image.
- Reduced KAGEMARU paired visuals to 112px height on phones and 98px on <=390px screens.


## v17.6.2
- Fix duplicate action buttons, especially duplicate `¥ 記帳`.
- Expense links are now generated from one source only.
- Added defensive de-duplication so legacy hand-authored controls do not reappear after refresh.


## v17.7 — 10/26 Night Route Refresh
- NEWoMan 高輪加入 Takanawa Night View Mission：North 4F Milk Tea Service → LUFTBAUM 28F 公共庭園。
- 正式加入 LAMMFROMM（Scramble Square 5F）與 Godzilla Store Shibuya（PARCO 6F）。
- Kenyan Shibuya 改為 IF TIME，為晚間第一順位可砍項。
- 正式加入 Onitsuka Tiger 新宿 Global Flagship（20:00 關門）。
- 鳥茂改為 MUST GO / 現場候位 / 時間彈性，不再綁 19:30。
- SHIBUYA SKY 不列入行程。


## v17.9 — UBER DEEP LINK
- Taxi Backup 路段新增 OPEN UBER / DRIVER CARD / ¥ 記車資三連按鈕。
- OPEN UBER 使用 Uber rider app deep link，以目前位置為 pickup 並預填目的地。
- 新增 10/26 渋谷 → Onitsuka Tiger 新宿為 Uber 救援路段。
- 在台灣測試時請只確認 Uber App 能否開啟，不要確認叫車。
