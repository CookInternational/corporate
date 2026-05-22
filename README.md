[README_CSC_PORTAL_v2.4.0_Alpha_FULL_UPDATED.md](https://github.com/user-attachments/files/28160644/README_CSC_PORTAL_v2.4.0_Alpha_FULL_UPDATED.md)
# CSC Portal v2.4.0 Alpha — Tiingo Grid, TradingView Ticker & Password Access Hardfix

**Last Updated:** 22 May 2026 @ 19:21:15Z UTC  
**Backend Build Stamp:** 22 May 2026 @ 19:21:15Z UTC  
**Backend Version:** `CSC PORTAL BACKEND v2.4.0 Alpha`  
**Frontend Version:** `CSC Portal Frontend v2.4.0 Alpha`  
**Sheet Name:** `CSC Website`  
**Spreadsheet ID:** `1AiSta8CqjbBAu5dZeiQoFmQ0Xdn054-v6soEa_hQ_RE`  
**Drive Folder Name:** `CSC Website`  
**Drive Folder ID:** `1qkgKz196pp0LHBgyoiTeABnImZ8sX569`  
**Web App URL:** `https://script.google.com/macros/s/AKfycbzZn7soezxSkOd7FeydEvP6M_3LiZmrQvcx6bWtULz8-ZXaEKJSNo2vElJ_DkS5D_eN2g/exec`  
**Portal URL:** `https://corporate.cook-international.com/portal/`  
**Executing Account:** `tips@cgnnews.net`  
**Visible Sender Name:** `Cook Services Company`  
**Company:** Cook Services Company, LLC  
**Copyright:** Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.

---

## 1. Purpose

CSC Portal v2.4.0 Alpha is the current production-alpha private investor portal for Cook Services Company.

This build keeps the v2 reporting, document, upload, and e-sign workflows intact, while adding three critical fixes:

1. **Tiingo-backed Portfolio Grid pricing** for both owned and research-only positions.
2. **TradingView ticker rendering after login**, so the market ticker does not fail inside a hidden portal container.
3. **Password access controls**, including Forgot Password on login and Change Password in Settings for admins and investors.

The portal remains manual-first for financial reporting. It does not require OCR, OpenAI statement parsing, Plaid, or sensitive bank-statement uploads to Drive.

---

## 2. Core operating rules

```text
CustomReport is the report source of truth.
Manual report edits always win.
Reports are sent manually only.
No monthly report time triggers.
Tiingo is a market-price helper only.
TradingView is visual only.
Research-only positions never count toward portfolio totals.
Sensitive bank/SSN/tax PDFs are not uploaded to Drive.
```

Reports must never silently use fake zeroes. A blank value should stay blank unless Michael intentionally enters `0`.

---

## 3. v2.4.0 Alpha changes

### 3.1 Tiingo Portfolio Grid hardfix

The Portfolio Grid now prices research-only rows as well as owned rows.

Backend behavior:

```text
Build quote list from MarketWatchlist + Positions.
Deduplicate tickers.
Fetch Tiingo quotes.
Save quote data to MarketPrices.
Join MarketPrices into every Positions row.
Prefer fresh MarketPrices.last_price over stale Positions.last_price.
Fallback to Positions.research_price_snapshot only if no Tiingo price exists.
```

Research-only behavior:

```text
position_status = research / research_only
include_in_portfolio_totals = FALSE
```

Research-only rows show:

```text
last_price
day_change
day_change_pct
quote_time_utc
provider
provider_status
```

Research-only rows do **not** affect:

```text
total_market_value
total_cost_basis
unrealized_gain_loss
portfolio totals
CustomReport totals
investor report totals
```

Owned rows only count in totals when:

```text
position_status = owned
include_in_portfolio_totals = TRUE
```

---

### 3.2 TradingView ticker hardfix

The market ticker is no longer dependent on static TradingView script tags inside a hidden portal container.

Frontend behavior:

```text
User logs in.
Portal app becomes visible.
Dashboard renders.
renderTradingViewTicker() runs.
TradingView ticker tape is injected dynamically.
```

This matches the reliable TradingView pattern used by the Investors page.

TradingView widgets are visual/reference only. They do not update official records, cost basis, report numbers, or accounting values.

---

### 3.3 Password access hardfix

v2.4.0 adds:

```text
Forgot Password? on login
Password reset email flow
Reset password screen from email link
Change Password card in Settings
Investor-accessible password change
Session invalidation after password change
```

No new sheet tab is required. Password reset tokens are stored in the existing `Sessions` tab.

---

## 4. Required Google Sheet tabs

The live `CSC Website` spreadsheet must contain these tabs:

```text
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
CustomReport
Logs
```

Do not rename these tabs.

---

## 5. Config setup

Required Config keys:

```text
VERSION = CSC Portal v2.4.0 Alpha
BACKEND_VERSION = CSC PORTAL BACKEND v2.4.0 Alpha
FRONTEND_VERSION = CSC Portal Frontend v2.4.0 Alpha
WEB_APP_URL = https://script.google.com/macros/s/AKfycbzZn7soezxSkOd7FeydEvP6M_3LiZmrQvcx6bWtULz8-ZXaEKJSNo2vElJ_DkS5D_eN2g/exec
PORTAL_DOMAIN = https://corporate.cook-international.com/portal/
FROM_NAME = Cook Services Company
COMPANY_EMAIL = tips@cgnnews.net
REPLY_TO = tips@cgnnews.net
DRIVE_DOCUMENTS_FOLDER_ID = 1qkgKz196pp0LHBgyoiTeABnImZ8sX569
MARKET_DATA_PROVIDER = TIINGO
MARKET_DATA_CACHE_MINUTES = 15
TIINGO_API_KEY_SOURCE = SCRIPT_PROPERTIES_AND_CONFIG_BACKUP
MONTHLY_REPORT_AUTO_SEND = FALSE
manual_statement_mode_enabled = TRUE
custom_report_mode_enabled = TRUE
legacy_statement_parser_enabled = FALSE
openai_statement_reader_enabled = FALSE
plaid_enabled = FALSE
brokerage_prefill_enabled = TRUE
brokerage_prefill_provider = TIINGO
manual_override_enabled = TRUE
sensitive_drive_uploads_allowed = FALSE
```

`TIINGO_API_KEY` may be stored in both Apps Script Project Settings and the Config tab as a backup. Script Properties are checked first.

---

## 6. Apps Script Project Settings

In Apps Script:

1. Open the CSC Portal project.
2. Go to **Project Settings**.
3. Under **Script Properties**, add or confirm:

```text
TIINGO_API_KEY = your Tiingo API key
```

Do not expose the Tiingo key in portal HTML.

---

## 7. appsscript.json

Use this manifest:

```json
{
  "timeZone": "America/New_York",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/script.scriptapp"
  ],
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Drive",
        "serviceId": "drive",
        "version": "v2"
      }
    ]
  }
}
```

No Google Docs/OCR scope is required for the active report workflow because OCR parsing is not the production path.

---

## 8. PortalUsers setup

The `PortalUsers` tab uses this header:

```text
user_id	email	password_plaintext	password_hash	salt	full_name	role	status	phone	company	can_view_dashboard	can_view_reports	can_view_documents	can_esign	can_admin	last_login_at	created_at	updated_at	notes
```

Required active users:

```text
user_michael_cook	michaelcook1995@icloud.com	[temporary password]		Michael Cook	super_admin	active		Cook Services Company	TRUE	TRUE	TRUE	TRUE	TRUE
user_ckeller_2136	ckeller2136@gmail.com	[temporary password]		Doug Cox	investor	active		Cook Services Company	TRUE	TRUE	TRUE	TRUE	FALSE
```

The portal currently supports `password_plaintext` for the v2 Alpha environment. `password_hash` and `salt` remain available for a later security hardening pass.

Login rules:

```text
If password_plaintext exists, compare login password to password_plaintext.
If password_plaintext is blank, fall back to password_hash/salt legacy behavior.
Only active users can log in.
```

---

## 9. Password reset and change-password workflow

### 9.1 Forgot Password

Login page includes:

```text
Forgot Password?
```

Backend action:

```text
requestPasswordReset
```

Behavior:

```text
User submits email.
Backend checks for an active PortalUsers row.
Response does not reveal whether the account exists.
If account exists, backend creates a one-time token.
The token hash is stored in Sessions.
Token status = password_reset_pending.
Token expires in 30 minutes.
Backend sends password reset email through MailApp.
```

Reset link format:

```text
https://corporate.cook-international.com/portal/?reset_token=TOKEN&email=EMAIL
```

The email does not include the new password.

### 9.2 Reset Password screen

When the portal sees:

```text
?reset_token=...&email=...
```

it opens the reset-password screen with:

```text
New Password
Confirm New Password
Reset Password
Back to Login
```

Backend action:

```text
resetPasswordWithToken
```

Behavior:

```text
Validate email.
Hash submitted token.
Find matching Sessions row with status password_reset_pending.
Confirm token is not expired.
Confirm password rules.
Update PortalUsers.password_plaintext.
Update PortalUsers.updated_at.
Mark reset session status password_reset_used.
Invalidate old active login sessions for that user.
Return success.
Frontend clears localStorage and returns to login.
```

### 9.3 Change Password in Settings

Settings includes a Change Password card for every logged-in user, including investors.

Fields:

```text
Current Password
New Password
Confirm New Password
Change Password
```

Backend action:

```text
changePassword
```

Behavior:

```text
Requires valid session token.
Works for super_admin, admin, and investor.
Verifies current password.
Applies password rules.
Updates PortalUsers.password_plaintext.
Updates PortalUsers.updated_at.
Invalidates other active sessions for the user.
Frontend logs the user out after success.
```

### 9.4 Password rules

```text
At least 10 characters
At least one uppercase letter
At least one lowercase letter
At least one number
At least one symbol
Cannot match current password
New password and confirmation must match
```

---

## 10. MarketWatchlist setup

The `MarketWatchlist` tab is used for Tiingo quote refreshes and TradingView widget symbols.

Recommended watchlist rows include:

```text
SPYI
VOO
IJH
KMX
GEHC
CNH
MAS
MKTX
DINO
CMCSA
DIS
PFE
NXPI
AVGO
CRSP
NTLA
TERN
ADMA
ANIP
LQDA
```

Every enabled ticker should have:

```text
enabled = TRUE
provider = TIINGO
refresh_interval_minutes = 15
```

---

## 11. Positions setup

The `Positions` tab controls the private portal Portfolio Grid.

Owned holdings:

```text
position_status = owned
include_in_portfolio_totals = TRUE
```

Research-only rows:

```text
position_status = research_only
include_in_portfolio_totals = FALSE
```

Research-only rows still receive Tiingo last price, quote time, day change, and provider status.

Cost basis remains manual.

---

## 12. MarketPrices setup

`MarketPrices` is written by Tiingo refresh.

Do not manually edit this tab unless troubleshooting.

Important fields:

```text
ticker
provider_symbol
security_name
asset_type
last_price
previous_close
open_price
high_price
low_price
volume
day_change
day_change_pct
currency
market_state
quote_time_utc
provider
provider_status
raw_json
updated_at
```

---

## 13. Reports and CustomReport

### 13.1 CustomReport model

`CustomReport` remains one report per row.

Keep this header exactly:

```text
custom_report_id	report_id	report_period_start	report_period_end	report_title	report_status	executive_summary	statement_numbers	portfolio_snapshot	cash_bank_summary	fidelity_brokerage_summary	owned_holdings	research_watchlist	transactions_cost_basis	budget_summary	capital_contributions	documents_statements_used	business_updates	exceptions	risk_compliance_notes	notes_to_investor	source_documents	total_market_value	total_cost_basis	unrealized_gain_loss	unrealized_gain_loss_pct	cash_balance	brokerage_reference_value	manual_override	status	updated_by	updated_at	notes
```

Each major report section is a column.

### 13.2 Manual report workflow

Reports are sent manually only:

```text
Start Blank Report or Open Custom Report Builder
Save Draft
Mark Pending Review
Approve This Report
Choose report
Choose recipients
Send Report
```

No report time triggers are used.

### 13.3 Send Controls

Reports tab includes:

```text
Report selector
Recipient checkboxes from ReportRecipients
Manual recipient email field
Approve Selected Report
Send Report
Test Send to Me
```

Normal send requires:

```text
Reports.status = approved
or
Reports.status = approved_with_exceptions
```

Test send goes only to the logged-in admin and does not mark the report sent.

Normal send marks `sent` only if at least one email actually sends.

Every send attempt writes to `EmailLog`.

---

## 14. ReportRecipients setup

The `ReportRecipients` tab must have at least one active recipient before normal sending can work.

Header:

```text
recipient_id	full_name	email	role	active	receive_monthly_report	receive_esign_notice	delivery_preference	last_sent_at	notes	created_at	updated_at
```

Required rows:

```text
recipient_michael_cook	Michael Cook	michaelcook1995@icloud.com	super_admin	TRUE	TRUE	TRUE	email		Test/admin recipient.
recipient_ckeller_2136	Doug Cox	ckeller2136@gmail.com	investor	TRUE	TRUE	TRUE	email		Investor recipient.
```

---

## 15. Documents and uploads

Documents upload to:

```text
Drive Folder ID: 1qkgKz196pp0LHBgyoiTeABnImZ8sX569
Drive Folder Name: CSC Website
```

Allowed in Drive:

```text
approved report PDFs
signed documents
operating agreements
investor packets
non-sensitive budget documents
general company documents
non-sensitive support files
```

Do **not** upload these to Drive:

```text
bank statements
SSN documents
full account-number documents
routing-number documents
tax ID documents
identity documents
raw sensitive brokerage PDFs
```

Documents tab features:

```text
Upload Document
Sync Drive Vault
Refresh Documents
Edit Document Line
View Document
Manual Numbers for statement-type docs only
```

Non-statement documents show document metadata only.

Statement-type documents show manual-number fields.

---

## 16. E-Sign workflow

E-sign uses the existing tabs:

```text
Documents
ESignRequests
ESignEvents
```

A document appears as signable when:

```text
Documents.requires_signature = TRUE
Documents.signature_status = pending
```

An e-sign request appears for a signer when:

```text
ESignRequests.signer_user_id = PortalUsers.user_id
or
ESignRequests.signer_email = PortalUsers.email
ESignRequests.request_status = pending
```

Signer workflow:

```text
Open E-Sign tab
View Document
View & E-Sign
Type legal name
Check consent
Submit E-Sign
```

Completed signatures write to `ESignEvents` and update request/document signature status.

---

## 17. Manual statement/brokerage reporting policy

Manual report entry remains the reporting source of truth.

For sensitive bank, brokerage, Fidelity, or tax documents:

```text
Do not upload sensitive PDFs to Drive.
Upload them to ChatGPT only when conversion help is needed.
Convert values into CustomReport text or manual verified fields.
Do not store raw sensitive PDFs in Drive.
```

Manual verified values override:

```text
Tiingo
TradingView
OCR
OpenAI parsing
Plaid
parser output
old statement summaries
```

---

## 18. TradingView policy

TradingView is used for visual dashboard widgets only:

```text
Ticker tape
Symbol overview chart
Market visual reference
```

TradingView does not write to:

```text
Positions
MarketPrices
Reports
CustomReport
Budget
CapitalContributions
Statements
Documents
```

Tiingo is the backend market-data source for the Portfolio Grid.

---

## 19. Deployment steps

1. Paste `CSC_PORTAL_BACKEND_v2.4.0_Alpha.gs` into the Apps Script project.
2. Replace `appsscript.json` if needed.
3. Confirm `TIINGO_API_KEY` exists in Script Properties.
4. Confirm Config has the v2.4.0 web app URL, Drive folder ID, and Tiingo backup/source rows.
5. Deploy as a **new Web App version**.
6. Replace the live portal website file with `index_v2.4.0_Alpha.html`.
7. Hard refresh the browser.
8. Log in as Michael.
9. Open Settings.
10. Run Health Check.
11. Open Positions and run Refresh Market Data.
12. Confirm research-only rows show Tiingo last prices.
13. Open Dashboard and confirm TradingView ticker/chart render.
14. Open Settings and test Change Password only after confirming you know the current password.
15. Test Forgot Password with a controlled user email.

---

## 20. Acceptance tests

### 20.1 Login

1. Log in as Michael.
2. Confirm dashboard loads.
3. Log out.
4. Log in as investor.
5. Confirm investor can view assigned reports/documents/e-sign requests.

### 20.2 Tiingo Portfolio Grid

1. Confirm `TIINGO_API_KEY` exists in Script Properties.
2. Open Positions.
3. Click Refresh Market Data.
4. Confirm MarketPrices updates.
5. Confirm owned rows show last price.
6. Confirm research-only rows show last price.
7. Confirm research-only rows do not count in summary totals.
8. Confirm cost basis is not overwritten.

### 20.3 TradingView ticker/chart

1. Log in.
2. Open Dashboard.
3. Confirm market ticker appears.
4. Confirm chart appears.
5. Click several chart symbols.
6. Confirm no JavaScript errors and chart re-renders.

### 20.4 Forgot Password

1. Log out.
2. Click Forgot Password.
3. Enter a valid user email.
4. Confirm a reset email is sent.
5. Open reset link.
6. Set a compliant new password.
7. Confirm old sessions are invalidated.
8. Log in with the new password.

### 20.5 Change Password

1. Log in as investor.
2. Open Settings.
3. Enter current password.
4. Enter new password and confirm it.
5. Submit.
6. Confirm logout after success.
7. Log in with the new password.

### 20.6 Reports

1. Open Reports.
2. Start Blank Report.
3. Fill a report section and manual numbers.
4. Save Draft.
5. Mark Pending Review.
6. Approve This Report.
7. Choose recipients.
8. Test Send to Me.
9. Send Report.
10. Confirm EmailLog row.
11. Confirm Reports status becomes sent only after successful send.

### 20.7 Documents

1. Upload a non-sensitive document.
2. Confirm it appears in Documents.
3. Edit Document Line.
4. Change requires_signature to TRUE.
5. Confirm signature_status becomes pending when appropriate.
6. Confirm non-statement docs do not show bank balance fields.

### 20.8 E-Sign

1. Confirm a document has requires_signature TRUE and signature_status pending.
2. Create or confirm ESignRequests row for Doug.
3. Log in as Doug.
4. Open E-Sign.
5. View Document.
6. View & E-Sign.
7. Type legal name.
8. Check consent.
9. Submit E-Sign.
10. Confirm request status becomes signed.

---

## 21. Troubleshooting

### 21.1 Backend version looks old

Run Health Check.

If the backend does not show v2.4.0, deploy a new Apps Script Web App version and hard refresh the browser.

### 21.2 Market prices do not update

Check:

```text
TIINGO_API_KEY exists in Script Properties.
MarketWatchlist rows have enabled = TRUE.
Positions rows have ticker values.
Apps Script has external_request scope.
Refresh Market Data was clicked.
```

### 21.3 TradingView ticker does not show

Check:

```text
Browser/ad blocker is not blocking s3.tradingview.com.
Portal dashboard is visible before widget render.
Hard refresh.
Try another browser.
```

### 21.4 Forgot Password email is in Sent but not received

If the email appears in the sender Sent folder, Apps Script/MailApp sent it. Check:

```text
recipient spam/junk/promotions
filters
blocked sender
Google Workspace SPF/DKIM/DMARC
bounce messages in tips@cgnnews.net
```

### 21.5 E-sign requests do not appear

Check:

```text
ESignRequests.signer_user_id matches PortalUsers.user_id.
ESignRequests.signer_email matches PortalUsers.email.
ESignRequests.request_status = pending.
Documents.document_id matches ESignRequests.document_id.
Documents.requires_signature = TRUE.
Documents.signature_status = pending.
```

### 21.6 Report send fails

Check:

```text
Reports.status is approved or approved_with_exceptions.
ReportRecipients.active = TRUE.
ReportRecipients.receive_monthly_report = TRUE.
At least one recipient is selected.
Apps Script has send_mail scope.
Logged-in user is admin/super_admin for normal send.
```

---

## 22. Security and privacy notes

This is an internal/private investor portal.

Current v2 Alpha still supports `password_plaintext` for operational simplicity. Treat the spreadsheet as confidential. A future security upgrade should migrate to hashed passwords only.

Do not store sensitive bank statements, full account numbers, SSNs, identity documents, raw tax documents, or raw sensitive brokerage PDFs in Drive.

Use CustomReport and manual verified values for sensitive report data.

---

## 23. Known design decisions

```text
No report time triggers.
No automatic bank PDF parser.
No OpenAI parser required.
No Plaid required.
No TradingView accounting values.
No research-only values in totals.
Manual report approval before normal send.
```

---

## 24. Version history summary

### v2.0.0 Alpha
CustomReport workflow bridge hardfix.

### v2.1.0 Alpha
Builder fail-open and blank report creation.

### v2.2.0 Alpha
Manual Send Report controls, recipient selection, Test Send to Me, e-sign view/sign controls, upload timeout improvement.

### v2.3.0 Alpha
TradingView chart restoration, document line editor, non-statement document metadata cleanup.

### v2.4.0 Alpha
Tiingo-backed research-only Portfolio Grid pricing, dynamic TradingView ticker, Forgot Password, reset password, and investor-accessible Change Password.

---

Last Updated: 22 May 2026 @ 19:21:15Z UTC  
Developed by Cook Technology Services  
Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.
End of README
