# Cook Services Company, LLC Corporate Website

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
