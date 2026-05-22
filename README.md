# CSC Portal v1.8.0 Alpha — Manual Statement Entry, Brokerage Prefill & Report Source Lock

**Last Updated:** 22 May 2026 @ 03:40:53Z UTC  
**Backend Build Stamp:** 22 May 2026 @ 03:40:53Z UTC  
**Backend Version:** `CSC PORTAL BACKEND v1.8.0 Alpha`  
**Frontend Version:** `CSC Portal Frontend v1.8.0 Alpha`  
**Company:** Cook Services Company, LLC  
**Website:** https://corporate.cook-international.com  
**Portal:** https://corporate.cook-international.com/portal/  
**Contact:** cookservicescompany@gmail.com  
**Copyright:** Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.

---

## Purpose

CSC Portal v1.8.0 Alpha makes the portal reliable by moving the financial reporting source of truth to **manual verified entries**.

Previous OCR and AI parsing attempts reached the uploaded statement files, but the backend logs showed the core failure clearly:

- Drive/OCR statement parsing returned `text_length: 0` and `parser: none`.
- OpenAI statement parsing returned `OpenAI did not return valid JSON`.
- Reports could not safely use parser output because no verified statement values were making it into `Statements.parsed_summary`.

This build stops treating PDF parsing as the required path. PDFs stay in the Drive vault as source documentation. CSC admin users manually enter verified bank and brokerage numbers. Reports use those manual verified values first.

---

## Operating principle

v1.8.0 Alpha uses this rule:

```text
Manual verified numbers first.
Tiingo market prefill second, only for brokerage market-price assistance.
PDF links as proof.
Parser / AI / Plaid disabled by default.
No fake zeros.
```

Reports must never silently use missing values as real zeros. A blank number remains blank/null unless an admin intentionally enters `0`.

---

## What changed from v7.1.0 / v7.1.1

### 1. Manual statement mode is now the source of truth

The portal now treats manually entered and verified statement summaries as the primary report source.

Manual entries are saved into the existing `Statements.parsed_summary` JSON field. No new tabs are required.

### 2. OCR, AI parsing, and Plaid are disabled by default

The parser tools are no longer part of the normal report workflow.

Default switches:

```text
CSC_MANUAL_STATEMENT_MODE_ENABLED = true
CSC_LEGACY_STATEMENT_PARSER_ENABLED = false
CSC_OPENAI_STATEMENT_READER_ENABLED = false
CSC_PLAID_ENABLED = false
```

Config-tab soft switches should also default to:

```text
manual_statement_mode_enabled = TRUE
legacy_statement_parser_enabled = FALSE
openai_statement_reader_enabled = FALSE
plaid_enabled = FALSE
```

### 3. Brokerage values can be prefilled with Tiingo

Brokerage/Fidelity values may use Tiingo for market data assistance.

Tiingo can safely prefill:

- latest price
- latest price date/time
- estimated market value if quantity is entered
- unrealized gain/loss if quantity and manual cost basis are entered
- market-data source note

Tiingo must **not** be treated as the official accounting source for:

- cost basis
- contributions
- withdrawals
- tax lots
- ownership status
- official brokerage statement balances

Those remain editable/manual.

### 4. Manual overrides always win

For both bank and brokerage reporting:

1. Manual verified entry
2. Manual draft entry, with report marked pending review
3. Tiingo prefill for brokerage market values only, with review flag if not verified
4. Parser / AI / Plaid only if explicitly re-enabled later
5. Needs Review

### 5. Source PDF links are attached to reports

Every report should include a **Source Documents Used** section with Drive links to the bank statements, Fidelity reports, brokerage statements, signed documents, and other supporting records used.

---

## Existing tabs used

Do **not** add new tabs.

Use existing tabs only:

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
Logs
```

---

## Required Config keys

Confirm these keys exist or add them to the existing `Config` tab:

```text
WEB_APP_URL = https://script.google.com/macros/s/AKfycbyzg1NZxxv0VQUEtK9H7yhoq2tPcTbhBsh9SiYnJDUbXXz6pnfMVndYCgIESN7eLWHG/exec
DRIVE_DOCUMENTS_FOLDER_ID = 1tkny64DDcoIXYuuVhOIeWxN2KS6U89EL
MARKET_DATA_PROVIDER = TIINGO
MARKET_DATA_CACHE_MINUTES = 15
MONTHLY_REPORT_DAY = 15
MONTHLY_REPORT_HOUR_ET = 9
MONTHLY_REPORT_AUTO_SEND = FALSE
PORTAL_DOMAIN = https://corporate.cook-international.com/portal/

manual_statement_mode_enabled = TRUE
legacy_statement_parser_enabled = FALSE
openai_statement_reader_enabled = FALSE
plaid_enabled = FALSE
brokerage_prefill_enabled = TRUE
brokerage_prefill_provider = TIINGO
manual_override_enabled = TRUE
```

If the Tiingo key is currently stored in Config, preserve that pattern. If it is stored in Apps Script Properties, that is also acceptable. Do not expose the Tiingo key in the portal HTML.

---

## appsscript.json

The v1.8.0 Alpha manifest does not need extra OCR/DocumentApp permissions if OCR parsing is disabled.

Minimum expected scopes remain:

```json
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/drive",
"https://www.googleapis.com/auth/script.external_request",
"https://www.googleapis.com/auth/script.send_mail",
"https://www.googleapis.com/auth/script.scriptapp"
```

Advanced Drive API v2 can remain enabled for Drive vault sync and file operations. It is no longer the required statement-reading path.

---

## Manual bank statement entry

Each bank statement card in Documents should include a **Manual Numbers** button.

The Manual Numbers editor should support:

```text
institution
account_name
account_number_last4
statement_type
statement_period_start
statement_period_end
statement_date
beginning_balance
ending_balance
cash_balance
total_credits
deposits
total_other_deposits
total_debits
withdrawals
card_withdrawals
other_withdrawals
checks_paid
fees
net_change
balance_on_report_start
balance_on_report_end
balance_on_15th
daily_balance_notes
transaction_count_manual
source_pdf_url
source_drive_file_id
manual_notes
manual_entry_status
verified_by
verified_at
```

Allowed manual entry statuses:

```text
draft
verified
needs_review
```

---

## Manual parsed_summary shape

Manual bank entries should save into `Statements.parsed_summary` like this:

```json
{
  "parser": "manual_statement_entry_v180",
  "source": "manual_entry",
  "institution": "U.S. Bank",
  "statement_type": "bank_statement",
  "account_name": "CSC Checking",
  "account_number_last4": "5923",
  "statement_period_start": "2026-04-01",
  "statement_period_end": "2026-04-30",
  "statement_date": "2026-04-30",
  "beginning_balance": 90.10,
  "ending_balance": 22.29,
  "cash_balance": 22.29,
  "total_credits": 524.65,
  "deposits": 524.65,
  "total_debits": 592.46,
  "withdrawals": 592.46,
  "card_withdrawals": 542.46,
  "other_withdrawals": 50.00,
  "fees": 0,
  "net_change": -67.81,
  "balance_on_report_start": null,
  "balance_on_report_end": null,
  "balance_on_15th": 465.41,
  "daily_balance_notes": "Manual entry from U.S. Bank statement daily balance summary.",
  "transaction_count_manual": 50,
  "source_pdf_url": "https://drive.google.com/...",
  "source_drive_file_id": "...",
  "manual_notes": "Entered from April U.S. Bank statement.",
  "manual_entry_status": "verified",
  "verified_by": "Michael Cook",
  "verified_at": "2026-05-22T03:40:53Z",
  "updated_at": "2026-05-22T03:40:53Z"
}
```

Blank numeric fields should be `null`, not `0`.

---

## Brokerage / Fidelity manual entry with Tiingo prefill

Brokerage statements and Fidelity reports should also use manual verified entries.

The portal should include a **Brokerage Numbers / Holdings** editor for brokerage-type documents and portfolio-reference documents.

The editor should support rows for holdings:

```text
ticker
security_name
quantity
manual_cost_basis
manual_average_cost
tiingo_last_price
tiingo_price_date
tiingo_market_value
manual_market_value_override
final_market_value
unrealized_gain_loss
unrealized_gain_loss_pct
holding_notes
include_in_portfolio_totals
position_status
```

Tiingo prefill behavior:

- Admin enters ticker and quantity.
- Admin clicks **Prefill Brokerage Values**.
- Backend fetches latest/cached Tiingo price.
- Backend calculates estimated market value.
- Admin can override market value or cost basis.
- Manual override wins.
- Cost basis remains manual.
- Final values must be reviewed and saved.

Brokerage parsed_summary example:

```json
{
  "parser": "manual_brokerage_entry_v180",
  "source": "manual_entry_with_tiingo_prefill",
  "institution": "Fidelity",
  "statement_type": "brokerage_statement",
  "account_name": "CSC Investments Brokerage",
  "account_number_last4": "1234",
  "statement_period_start": "2026-04-01",
  "statement_period_end": "2026-04-30",
  "statement_date": "2026-04-30",
  "brokerage_total_value": 8268.91,
  "brokerage_cash": null,
  "brokerage_manual_notes": "Fidelity GPS / statement values manually reviewed.",
  "tiingo_prefill_used": true,
  "tiingo_prefill_provider": "TIINGO",
  "holdings": [
    {
      "ticker": "VOO",
      "security_name": "Vanguard S&P 500 ETF",
      "quantity": 1.25,
      "manual_cost_basis": 600.00,
      "manual_average_cost": 480.00,
      "tiingo_last_price": 505.00,
      "tiingo_price_date": "2026-05-22",
      "tiingo_market_value": 631.25,
      "manual_market_value_override": null,
      "final_market_value": 631.25,
      "unrealized_gain_loss": 31.25,
      "unrealized_gain_loss_pct": 5.21,
      "include_in_portfolio_totals": true,
      "position_status": "owned",
      "holding_notes": "Price prefilled from Tiingo; cost basis manually entered."
    }
  ],
  "manual_entry_status": "verified",
  "verified_by": "Michael Cook",
  "verified_at": "2026-05-22T03:40:53Z",
  "updated_at": "2026-05-22T03:40:53Z"
}
```

---

## Backend actions for v1.8.0 Alpha

Required manual bank actions:

```text
getManualStatementEntry
saveManualStatementEntry
verifyManualStatementEntry
clearManualStatementEntry
getStatementDiagnostics
```

Required brokerage/Tiingo actions:

```text
getManualBrokerageEntry
saveManualBrokerageEntry
verifyManualBrokerageEntry
prefillBrokerageFromTiingo
refreshMarketData
```

Report actions that must continue working:

```text
getReports
generateMonthlyReport
testReport
saveReportEdits
saveReportSectionNote
approveReport
sendApprovedReport
```

Document actions that must continue working:

```text
getDocuments
uploadDocument
syncDriveVaultDocuments
classifyDocument
```

---

## Report source priority

Reports must use this priority order:

```text
1. Manual verified bank statement entry
2. Manual verified brokerage/Fidelity entry
3. Manual draft entry, but report remains pending_review
4. Tiingo prefilled brokerage market value, only when manually reviewed
5. Parser/AI/Plaid only if re-enabled later
6. Needs Review
```

Manual verified values must not be overwritten by Tiingo, OCR, AI, or Plaid.

---

## 15th-to-15th report handling

CSC reports use a 15th-to-15th reporting window.

If manual entries include exact 15th-to-15th balances:

```text
balance_on_report_start
balance_on_report_end
```

the report should use those values.

If only monthly beginning/ending balances are entered, the report may generate but must remain:

```text
pending_review
```

and include this exception:

```text
Manual monthly statement values were entered, but exact 15th-to-15th balances were not provided.
```

If `balance_on_15th` is entered, the report should use it where applicable and explain the basis in report notes.

---

## Source Documents Used section

Every generated report should include a section called:

```text
Source Documents Used
```

This section should include links to:

- U.S. Bank statement PDFs
- Huntington statement PDFs, when added
- Fidelity brokerage statements / GPS reports
- signed documents
- budgets or supporting documents
- manually attached Drive links

PDFs are evidence/source documents only. They are not required to be parsed.

---

## Portal UI requirements

### Documents tab

Each statement/brokerage document card should show:

```text
Manual status
Source type
Institution
Account last four
Statement period
Beginning balance
Ending balance
Deposits / credits
Withdrawals / debits
Fees
Brokerage total value, if brokerage
Tiingo prefill status, if brokerage
Source PDF link
Verified by
Verified at
```

Buttons:

```text
Manual Numbers
Brokerage Numbers / Holdings
Prefill Brokerage Values
Save Draft
Mark Verified
Clear Manual Entry
Open PDF
```

### Reports tab

Reports should show:

```text
Statement-backed: Yes/No
Manual verified source: Yes/No
Brokerage prefill used: Yes/No
Source statement IDs
Source PDF links
Exceptions
Pending review / approved status
```

### Settings tab

Settings should show:

```text
Manual Statement Mode: Enabled
Legacy Parser: Disabled
OpenAI Statement Reader: Disabled
Plaid: Disabled
Brokerage Tiingo Prefill: Enabled
Report Source Priority: Manual Verified Entries First
```

---

## Safety rules

- Never store blank numeric fields as `0`.
- Never let Tiingo overwrite manual verified values.
- Never use TradingView widget values as accounting values.
- Research-only positions never count toward portfolio totals.
- Owned positions count only when explicitly marked owned and included in totals.
- Cost basis remains manual unless separately verified.
- PDF parser / AI parser / Plaid cannot override manual verified numbers.
- Reports must remain `pending_review` until approved.
- Investor emails only send approved or approved-with-exceptions reports.

---

## Setup steps

1. Replace the Apps Script backend with the v1.8.0 Alpha backend.
2. Replace portal `/portal/index.html` with the v1.8.0 Alpha portal frontend.
3. Confirm Config keys are present.
4. Confirm Tiingo key is available through Config or Apps Script Properties.
5. Deploy Apps Script as a new Web App version:
   - Execute as: Me
   - Who has access: Anyone, or the current portal setting.
6. Upload or sync statement PDFs into the Drive vault.
7. Open the portal.
8. Go to Documents.
9. Use Manual Numbers / Brokerage Numbers to enter verified values.
10. Mark each entry verified.
11. Generate the report.
12. Review source links and exceptions.
13. Approve the report.
14. Send only after approval.

---

## Acceptance tests

### Bank manual entry

1. Open portal.
2. Go to Documents.
3. Open a U.S. Bank statement card.
4. Click **Manual Numbers**.
5. Enter January statement values.
6. Save Draft.
7. Refresh portal.
8. Confirm values persist.
9. Mark Verified.
10. Confirm status shows Verified.
11. Repeat for February, March, and April.

### Brokerage / Tiingo prefill

1. Open a Fidelity or brokerage document card.
2. Click **Brokerage Numbers / Holdings**.
3. Enter a ticker and quantity.
4. Click **Prefill Brokerage Values**.
5. Confirm Tiingo price and market value appear.
6. Enter or edit cost basis manually.
7. Save Draft.
8. Mark Verified.
9. Confirm verified brokerage value appears in report inputs.

### Report generation

1. Generate report.
2. Confirm report uses manual bank values, not parser zeros.
3. Confirm report uses verified brokerage values.
4. Confirm Tiingo-assisted numbers are labeled as market-data prefills, not official brokerage accounting.
5. Confirm source PDF Drive links appear.
6. Confirm report remains pending review until approved.
7. Confirm section pencil notes still save.
8. Confirm Send Approved Report only sends approved reports.

---

## Known design decision

v1.8.0 Alpha intentionally stops trying to solve PDF OCR inside Apps Script as the critical reporting path.

The portal is now designed to function reliably by combining:

```text
Manual verified statement numbers
+ Tiingo brokerage market-price prefills
+ source PDF links
+ report approval controls
```

This is the stable foundation. OCR, AI, Plaid, or other aggregators can be reintroduced later as optional helpers, but not as the required path for investor reports.

---

Last Updated: 22 May 2026 @ 03:40:53Z UTC  
Developed by Cook Technology Services  
Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.
End of README
