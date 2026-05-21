# Cook Services Company, LLC Corporate Website | Copyright © 2026 Cook Services Company, LLC.  All Rights Reserved. 

Static GitHub Pages website for Cook Services Company, LLC.

## Updated Public Site Scope

This build updates the public-facing CSC corporate website only.

Included changes:

- `index.html` — refreshed homepage positioning for Cook Services Company, LLC and CSC Investments.
- `investors/index.html` — new public CSC Investments page with a research-only portfolio snapshot, TradingView-style market dashboard, ticker tape, filters, and all 20 CSC Investments holdings/reference prices.
- `terms/index.html` — professional Terms of Service with no-securities-offering language, Rule 506(b)-safe posture, and Rule 506(d) correction.
- `privacy/index.html` — professional Privacy Policy with investor/contact-data, future portal, market-data, and security language.
- `assets/csc-shell.js` — shared header/footer updates, enlarged header logo, CSC Investments footer logo, global contact email update, and Investors navigation.
- `assets/csc-style.css` — premium CSC/CSC Investments styling, responsive header/footer/logo sizing, investors page layout, market widgets, ticker, filters, cards, and legal page polish.

## Not Included Yet

- `/portal/` is intentionally not built in this pass.
- No login system is included in this pass.
- No account-specific cost basis, contribution history, investor documents, or restricted portal data is included in this pass.

## Contact

Cook Services Company, LLC public contact email:

`cookservicescompany@gmail.com`

All CSC public mailto links should use:

`mailto:cookservicescompany@gmail.com`

CGN News may remain a portfolio/brand link, but CGN News emails are not used as Cook Services Company corporate contact information.

## Logos

Header logo:

`/CSCLogo01.png`

Footer CSC Investments logo:

`/CSCInvestmentsLogo.png`

Both header and footer logos link back to `/`.

## Investors Page

Public route:

`/investors/`

The page displays:

- CSC Investments public portfolio snapshot.
- TradingView-style market chart widget.
- TradingView ticker/ticker tape pattern using CSC Investments watchlist symbols.
- Research-only watchlist cards grouped by sleeve.
- Search and sleeve filters.
- Cost basis / reference prices as of `05-19-26`.

The page is informational only and is not a securities offering, investment advice, legal advice, tax advice, financial advice, or accounting advice.

## Market Data Strategy

This public build uses embedded TradingView widgets and static reference/cost-basis data.

Future options:

- Static `/assets/investments-watchlist.json` export.
- Google Sheets watchlist tab.
- Google Apps Script endpoint such as `?action=getCSCInvestmentsWatchlist`.
- Delayed quote fields using Google Sheets / GOOGLEFINANCE where appropriate.

Do not scrape Yahoo Finance.

## Legal Posture

The website uses a 506(b)-safe public posture:

- No public offering language.
- No public solicitation language.
- No “Invest Now,” “Become an Investor,” “Request Offering Materials,” or similar CTA.
- Public information is research-only and informational.
- Rule 506(d) is correctly described as bad-actor disqualification and related compliance review, not an offering exemption.

## Deploy

Upload the changed files to the GitHub Pages repository root, commit, and confirm GitHub Pages is publishing from the correct branch.


## SEO / Indexing Package

This build is configured for the GitHub Pages custom domain:

`corporate.cook-international.com`

Included search/indexability files:

- `CNAME` — set to `corporate.cook-international.com`
- `robots.txt` — allows crawling and points to the sitemap
- `sitemap.xml` — lists the homepage, Investors page, Terms page, and Privacy page
- `favicon.ico`
- `favicon-48x48.png`
- `favicon-96x96.png`
- `apple-touch-icon.png`
- `site.webmanifest`
- `.nojekyll`

After deployment, submit this sitemap in Google Search Console:

`https://corporate.cook-international.com/sitemap.xml`

# CSC Private Portal v1.0 — Setup & Testing README

This build adds the private Cook Services Company `/portal/` system and targeted mobile fixes to `/investors/`.

## Returned website files

Only these website files need to be updated in the corporate repo:

```txt
/portal/index.html
/investors/index.html
```

No other website files are required for this build.

## Backend file

Upload this Apps Script file into the CSC Website Google Apps Script project:

```txt
CSC_PORTAL_BACKEND.gs
```

This file is intentionally CSC-branded and uses the existing CSC Website Google Sheet only.

## Locked Google Sheet

Workbook:

```txt
CSC Website
```

Spreadsheet ID:

```txt
1mt6mEqqPajvsXzUb6DKuxoIhVEkiMXx8SP2rqyEMI_Q
```

Use only these approved tabs:

```txt
Config
PortalUsers
Sessions
Accounts
Positions
Transactions
MarketWatchlist
MarketPrices
MarketHistory
Statements
Documents
ESignRequests
ESignEvents
Reports
ReportRecipients
EmailLog
BusinessUpdates
Approvals
CapitalContributions
MemberLedger
Budget
Logs
```

Do not add extra tabs.

## Required Config rows

Confirm these rows exist in `Config`:

```txt
config_key	config_value	description	value_type	is_secret	environment	updated_at	updated_by
WEB_APP_URL	https://script.google.com/macros/s/AKfycbyzg1NZxxv0VQUEtK9H7yhoq2tPcTbhBsh9SiYnJDUbXXz6pnfMVndYCgIESN7eLWHG/exec	Main CSC Google Apps Script Web App endpoint	string	FALSE	production		
DRIVE_DOCUMENTS_FOLDER_ID	1tkny64DDcoIXYuuVhOIeWxN2KS6U89EL	Main CSC portal Google Drive document vault folder	string	FALSE	production		
MARKET_DATA_PROVIDER	FMP	Primary market data provider for ticker, chart, latest quotes, ETFs, and index quotes	string	FALSE	production		
MARKET_DATA_CACHE_MINUTES	15	Minimum quote cache window before backend refreshes market prices	number	FALSE	production		
MONTHLY_REPORT_DAY	15	Monthly investor report generation day	number	FALSE	production		
MONTHLY_REPORT_HOUR_ET	9	Monthly investor report generation hour in Eastern Time	number	FALSE	production		
MONTHLY_REPORT_AUTO_SEND	FALSE	V1 safety lock. Reports generate but do not send final investor email unless approved.	boolean	FALSE	production		
PORTAL_DOMAIN	https://corporate.cook-international.com/portal/	CSC portal URL	string	FALSE	production		
```

## Private API key setup

Do not paste the market API key into the Google Sheet or website.

In Apps Script:

```txt
Project Settings → Script Properties → Add script property
```

Add:

```txt
FMP_API_KEY = your Financial Modeling Prep API key
```

## Drive document vault

Drive folder ID:

```txt
1tkny64DDcoIXYuuVhOIeWxN2KS6U89EL
```

The Apps Script owner must have access to this folder. Keep the folder restricted/private. Portal users should access documents through the portal workflow, not public Drive sharing.

## Apps Script authorization

Deploy the Apps Script web app as:

```txt
Execute as: Me
Who has access: Anyone
```

This does not make the portal data public because the backend requires portal session tokens for private actions.

## Optional PDF text extraction / OCR

For statement parsing, the backend attempts summary-level extraction only. It stores the result in:

```txt
Statements.parsed_summary
Statements.parsed_status
Logs.raw_payload_json
```

No extra parsing tabs are added.

For better PDF/OCR extraction, enable the Advanced Google Service:

```txt
Apps Script → Services → Add a service → Drive API
```

Also enable Drive API in the linked Google Cloud project if prompted.

If Drive API is not enabled, uploaded statements still save to Drive and log to `Documents` / `Statements`, but `parsed_status` will remain `needs_review`.

## User setup

Users are admin-created only. No public signup.

Michael:

```txt
Email: michaelcook1995@icloud.com
Role: super_admin
```

Doug:

```txt
Email: ckeller2136@gmail.com
Role: investor
```

Do not paste plain-text passwords into the Sheet.

### Initial password setup

In `CSC_PORTAL_BACKEND.gs`, temporarily edit these two constants near the top:

```js
var CSC_INITIAL_MICHAEL_PASSWORD = "CHANGE_ME_BEFORE_RUNNING";
var CSC_INITIAL_DOUG_PASSWORD = "CHANGE_ME_BEFORE_RUNNING";
```

Replace the placeholder values with strong temporary passwords.

Then run this function once from the Apps Script editor:

```js
CSC_setInitialPortalPasswords
```

After it succeeds, immediately clear the passwords back to placeholders or remove the temporary values before saving again.

The function will create/update:

```txt
PortalUsers
ReportRecipients
```

## Header initialization

If any approved tabs are empty or missing headers, run:

```js
CSC_initializeHeadersOnly
```

This creates headers only for the approved tabs. It does not add extra tabs.

## Monthly report trigger

The portal Settings tab has a button to create the monthly trigger.

You can also run this manually after logging in as Michael and using Settings:

```txt
Create Monthly Trigger
```

The backend creates a trigger for:

```txt
15th day of each month, approximately 9:00 AM Eastern
```

V1 safety rule:

```txt
MONTHLY_REPORT_AUTO_SEND = FALSE
```

Reports generate as pending review. Final investor email sends only after approval.

## Market data behavior

Primary source:

```txt
Financial Modeling Prep / FMP
```

Backend behavior:

```txt
FMP → Apps Script → MarketPrices / MarketHistory → /portal frontend
```

The browser never sees the FMP API key.

Market data may update:

```txt
last_price
MarketPrices
MarketHistory
chart/ticker display
calculated market value display
```

Market data must never overwrite:

```txt
quantity
average_cost
cost_basis
transactions
statements
capital contributions
member ledger
approved financial records
```

## Research-only rule

Rows in `Positions` where either condition is true are excluded from all portfolio totals:

```txt
position_status = research_only
include_in_portfolio_totals = FALSE
```

They display only in the research/watchlist section.

Owned rows count only when:

```txt
position_status = owned
include_in_portfolio_totals = TRUE
```

## Website update notes

### `/portal/index.html`

Adds:

```txt
Login
Dashboard
Positions
Reports
Documents
E-Sign
Settings
```

### `/investors/index.html`

Targeted changes only:

```txt
- Added Investor Login button to the left of Contact Cook Services Company.
- Investor Login links to /portal/.
- Mobile ticker now stays in the same horizontal layout as desktop.
- Mobile bottom position cards become horizontal scroll cards.
- No change to what /investors reads or how its existing page data/functions work.
```

## Exact testing checklist

### 1. Deploy website files

Copy these files into the corporate repo:

```txt
/portal/index.html
/investors/index.html
```

Commit and push to GitHub Pages.

### 2. Deploy Apps Script

Paste/upload `CSC_PORTAL_BACKEND.gs` into the CSC Website Apps Script project.

Confirm:

```txt
CSC_SPREADSHEET_ID = 1mt6mEqqPajvsXzUb6DKuxoIhVEkiMXx8SP2rqyEMI_Q
CSC_DRIVE_DOCUMENTS_FOLDER_ID = 1tkny64DDcoIXYuuVhOIeWxN2KS6U89EL
```

### 3. Add FMP key

Apps Script → Project Settings → Script Properties:

```txt
FMP_API_KEY = your key
```

### 4. Run setup functions

Run:

```js
CSC_initializeHeadersOnly
```

Set temporary passwords and run:

```js
CSC_setInitialPortalPasswords
```

Then clear the temporary password constants.

### 5. Re-deploy web app

Deploy as:

```txt
Execute as: Me
Who has access: Anyone
```

Use this URL:

```txt
https://script.google.com/macros/s/AKfycbyzg1NZxxv0VQUEtK9H7yhoq2tPcTbhBsh9SiYnJDUbXXz6pnfMVndYCgIESN7eLWHG/exec
```

### 6. Test backend health

Open:

```txt
https://script.google.com/macros/s/AKfycbyzg1NZxxv0VQUEtK9H7yhoq2tPcTbhBsh9SiYnJDUbXXz6pnfMVndYCgIESN7eLWHG/exec?action=health
```

Expected:

```txt
ok: true
spreadsheet_id present
drive_folder_id present
tabs listed
```

### 7. Test portal login

Open:

```txt
https://corporate.cook-international.com/portal/
```

Login as Michael:

```txt
michaelcook1995@icloud.com
```

Expected:

```txt
Dashboard loads
Tabs appear
Settings shows super_admin
```

### 8. Test market data refresh

In `/portal/`:

```txt
Settings or Positions → Refresh Market Data
```

Expected:

```txt
MarketPrices fills/updates
MarketHistory fills/updates for chart symbol
Dashboard ticker updates
Chart displays
```

### 9. Test positions

Expected:

```txt
Research-only rows display separately
Portfolio totals remain zero unless owned rows exist
No research-only ticker counts toward market value, cost basis, gain/loss, or account value
```

### 10. Test document upload

Upload a small PDF first.

Expected:

```txt
File appears in Drive folder
Documents row created
If statement type, Statements row created
parsed_status = needs_review unless extraction succeeds
```

### 11. Test report generation

In Reports:

```txt
Generate Report
```

Expected:

```txt
Reports row created
status = pending_review
html_body populated
summary/notes show review items
```

### 12. Test approval and email

Approve report from the portal.

Then click:

```txt
Send Approved Report
```

Expected:

```txt
Email sends to active ReportRecipients
EmailLog records each send
Reports.emailed_at updates
```

### 13. Test `/investors/` mobile

On mobile width:

```txt
Ticker remains horizontal like desktop
Investor Login button appears before Contact Cook Services Company
Bottom position cards scroll left/right
Existing investor page data/functions remain unchanged
```
