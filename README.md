[Uploading CSC_PORTAL_REPORTS_DOCUMENTS_README.md…]()
# CSC Portal v1.7.1 Alpha - Reports, Documents & Drive Vault | Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.


**Cook Services Company, LLC**  
**Build:** CSC Portal v1.7.1 Alpha  
**Updated:** 22 May 2026 @ 02:50:49Z UTC   
**Website:** https://corporate.cook-international.com  
**Portal:** https://corporate.cook-international.com/portal/  
**Contact:** cookservicescompany@gmail.com

# CSC Portal Backend + Frontend v7.1.1 Alpha

Last Updated: 22 May 2026 @ 02:50:49Z UTC  
Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.

## Purpose
This build adds Plan C: an OpenAI-powered statement document reader for CSC Portal. v7.1.0 proved that the backend could find the U.S. Bank statement rows, but Drive/OCR extraction returned `text_length: 0` and `parser: none`, so the U.S. Bank parser never received readable text.

The v7.1.1 fix bypasses that failure path by sending the Drive PDF bytes from the backend to OpenAI as a file input, asking for strict statement JSON, validating the result, and saving it into `Statements.parsed_summary`.

## Critical security note
The OpenAI API key must not be hardcoded into the `.gs` file or portal HTML. This build reads it from the existing `Config` tab key:

- `openai_api_key`

Optional Config keys:

- `openai_model` — defaults to `gpt-4.1` if blank.
- `openai_statement_reader_enabled` — optional TRUE/FALSE soft switch.

Because the API key was pasted into chat during troubleshooting, rotate that key after deployment/testing.

## Manual enable / disable
The backend has a hard kill switch near the top of the `.gs` file:

- `CSC_AI_STATEMENT_READER_ENABLED = true` enables AI parsing.
- `CSC_AI_STATEMENT_READER_ENABLED = false` disables all OpenAI statement reader actions immediately.

The Config tab can also disable the feature with `openai_statement_reader_enabled = FALSE`, but the `.gs` flag is the hard override.

## New backend actions
- `aiParseStatement`
- `aiParseStatements`
- `aiTestStatementReader`
- `getStatementParseDiagnostics`

## Portal changes
- Documents tab now has **AI Parse Statements** beside the legacy Drive OCR parse button.
- Each statement card now has **AI Re-parse**.
- Statement cards show parser source, model, confidence, review reasons, deposits, withdrawals, daily balance count, transaction count, and parsed summary preview.
- Existing section-level report pencil notes from v7.1.0 are preserved.

## Data flow
1. Portal calls `aiParseStatements` or `aiParseStatement`.
2. Backend verifies admin permissions.
3. Backend checks `CSC_AI_STATEMENT_READER_ENABLED`.
4. Backend reads `openai_api_key` from Config.
5. Backend reads the Drive PDF blob.
6. Backend sends the PDF file to OpenAI using file input.
7. OpenAI returns JSON only.
8. Backend validates/normalizes the JSON.
9. Backend writes it to `Statements.parsed_summary`.
10. Reports use `Statements.parsed_summary` as the source of truth.

## No new tabs
This build uses existing tabs only:

- Config
- Statements
- Documents
- Reports
- Logs
- Accounts
- Positions
- Transactions
- Budget
- CapitalContributions
- MemberLedger
- BusinessUpdates

## Acceptance test
1. Deploy the new backend.
2. Deploy the new portal HTML.
3. Confirm Config tab has `openai_api_key`.
4. Set `CSC_AI_STATEMENT_READER_ENABLED = true` in the `.gs` file.
5. Open the portal.
6. Go to Documents.
7. Click **AI Parse Statements**.
8. Confirm U.S. Bank statements no longer show `parser: none`.
9. Confirm `Statements.parsed_summary` contains `parser: openai_document_reader_v711`.
10. Confirm parsed JSON has period dates, balances, deposits/withdrawals if visible, and review reasons if needed.
11. Generate report.
12. Confirm report is not silently all zeros.

## Build files
- `CSC_PORTAL_BACKEND_v7.1.1_Alpha.gs`
- `index_v7.1.1_Alpha.html`
- `README_CSC_PORTAL_v7.1.1_Alpha.md`
- `appsscript_v7.1.1_Alpha.json`

# CSC Portal v7.1.0 Alpha

**Last Updated:** 22 May 2026 @ 02:19:59Z UTC  
**Backend Build Stamp:** 22 May 2026 @ 02:19:59Z UTC  
**Backend Version:** `CSC PORTAL BACKEND v7.1.0 Alpha`  
**Frontend Version:** `CSC Portal Frontend v7.1.0 Alpha`  
**Copyright:** Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.

## Purpose

This build fixes the CSC Portal report pipeline so uploaded U.S. Bank statements and Fidelity GPS/reference reports are actually read, parsed, saved into `Statements.parsed_summary`, and used by the monthly investor report builder. It also updates the portal report preview so each report section has its own pencil-icon note editor.

## What changed from v1.7.0 Alpha

### 1. Verification-first PDF extraction

The backend now treats statement parsing as a visible chain:

`Drive PDF → text extraction/OCR → parser detection → parsed_summary JSON → report builder → portal preview`

For every parsed statement, the backend records diagnostic values such as:

- `text_length`
- `extraction_method`
- `parser`
- `institution`
- `statement_period_start`
- `statement_period_end`
- `beginning_balance`
- `ending_balance`
- `balance_by_date`
- `parsed_at`
- `needs_review`

If text extraction fails or returns too little text, the statement is marked `needs_review` instead of silently producing zero-filled reports.

### 2. U.S. Bank parser hardening

The U.S. Bank parser was hardened for Business Essentials Checking statement formats, including:

- optional dollar signs
- spaces after dollar signs
- trailing minus signs such as `542.46-`
- item counts before amounts such as `Other Deposits 3 524.65`
- beginning and ending balance fallback period detection
- daily balance summaries for 15th-to-15th reporting
- parsed transactions where possible

### 3. Fidelity GPS/reference parser

Fidelity GPS / Guided Portfolio Summary documents are treated as portfolio-reference material, not the official cash accounting source. The parser stores values such as total selected account value and account-level reference values, while marking the document as educational/reference-only.

### 4. 15th-to-15th report logic

Monthly reports still use the 15th-to-15th reporting window. If the requested period is incomplete, the report builder falls back to the latest complete two-month bank-statement-backed period and records the reason in report notes.

Reports now use `Statements.parsed_summary` for statement-backed cash numbers and do not silently treat missing values as correct zero values.

### 5. Portal section notes with pencil icons

The portal report preview now adds pencil icons beside editable report sections. Each section note saves through the backend action `saveReportSectionNote` and is stored inside the existing `Reports.notes` JSON under:

```json
{
  "section_notes": {
    "capital_contributions": {
      "text": "Example note",
      "updated_at": "2026-05-22T02:19:59.000Z",
      "updated_by": "admin@example.com"
    }
  }
}
```

No new Google Sheet tabs are required.

## Files in this package

- `CSC_PORTAL_BACKEND_v7.1.0_Alpha.gs` — full corrected Apps Script backend
- `index_v7.1.0_Alpha.html` — corrected portal frontend
- `README_CSC_PORTAL_v7.1.0_Alpha.md` — this README
- `appsscript_v7.1.0_Alpha.json` — manifest copy with Drive/Sheets/Mail scopes and Advanced Drive API v2

## Required Apps Script setup

1. Open the Apps Script project.
2. Replace the backend `.gs` file with `CSC_PORTAL_BACKEND_v7.1.0_Alpha.gs`.
3. Confirm `appsscript.json` is visible in Project Settings.
4. Confirm Advanced Google Services includes **Drive API v2**.
5. Confirm the Google Cloud project has Drive API enabled.
6. Deploy a new Web App version as:
   - Execute as: **Me**
   - Who has access: **Anyone** or the same public setting currently used by the portal

## Portal setup

Replace the existing portal `index.html` with `index_v7.1.0_Alpha.html`.

The portal web app URL is unchanged:

```text
https://script.google.com/macros/s/AKfycbyzg1NZxxv0VQUEtK9H7yhoq2tPcTbhBsh9SiYnJDUbXXz6pnfMVndYCgIESN7eLWHG/exec
```

## Acceptance test

1. Log into the portal as admin.
2. Upload or sync the March U.S. Bank statement.
3. Upload or sync the April U.S. Bank statement.
4. Click **Parse Statements**.
5. Open the Documents tab and confirm statement rows show parser diagnostics:
   - parser
   - text length
   - extraction method
   - period dates
   - beginning and ending balances
6. Click **Generate Report**.
7. Open **Preview / Edit**.
8. Confirm cash numbers are not all zero when statements parsed successfully.
9. Click the pencil icon beside **Capital Contribution Summary**.
10. Add a note and save.
11. Refresh reports and preview again.
12. Confirm the note remains visible under that section.
13. Approve only after statement values and notes are reviewed.

## Notes

- No new tabs were added.
- Canonical sheet headers were preserved.
- The backend uses one `doGet` and one `doPost`.
- The section-note workflow stores data in existing `Reports.notes` JSON.
- Accounting corrections should still be made in source records, not hidden report HTML.


# CSC Portal Backend v1.7.0 Alpha

Last Updated: 21 May 2026 @ 23:46:42Z UTC  
Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.

## Purpose
This build cleans the report/parser backend so bank statements produce real numbers instead of zero-filled reports.

## Major changes
- Cleaned duplicate function declarations from the prior hotfix stack.
- Preserved one `doGet` and one `doPost`.
- Added U.S. Bank Business Essentials Checking parser.
- Added Fidelity GPS Guided Portfolio Summary parser for portfolio-reference values.
- Added Drive OCR / Google Docs text extraction path for PDFs.
- Reports now use the latest complete bank-statement-backed 15th-to-15th period.
- Report numbers pull from `Statements.parsed_summary`.
- No new Google Sheet tabs.
- No canonical header changes.

## Required setup
1. Apps Script Project Settings: show `appsscript.json`.
2. Services: enable Advanced Drive API v2.
3. Use the included manifest.
4. Run `CSC_manualParseStatements()`.
5. Run `CSC_manualGenerateReportForLatestCompletePeriod()`.

## Statement parsing target
For uploaded U.S. Bank statements, the parser extracts account summary fields, daily balance summary, and transactions where possible. For the March/April statement pair, reports can derive the 15 March–15 April period using the daily balances and parsed transaction activity.


This README documents the CSC private portal reports/documents update. It is built on top of the locked CSC Website Google Sheet and the existing corporate GitHub Pages site.

## What changed in v1.6.0 Beta

This build adds the Reports/Documents foundation that was missing from the v1.5.0 Beta portal:

- Drive Vault Sync for files manually uploaded to Google Drive.
- Document classification/edit controls inside `/portal/`.
- Statement parsing workflow using the existing `Statements` tab only.
- 15th-to-15th monthly report period logic.
- Branded report emails with CSC Investments logo, portal button, and footer.
- Corrected all CSC contact email references to `cookservicescompany@gmail.com`.
- Added `appsscript.json` using Drive API v2 Advanced Service only.

## Returned files

```txt
CSC_PORTAL_BACKEND_v1.6.0_Beta.gs
portal/index.html
appsscript.json
CSC_PORTAL_REPORTS_DOCUMENTS_README.md
CSC_Portal_Reports_Documents_Manual_v1.0.pdf
```

## Locked Google Sheet

Workbook:

```txt
CSC Website
```

Spreadsheet ID:

```txt
1mt6mEqqPajvsXzUb6DKuxoIhVEkiMXx8SP2rqyEMI_Q
```

Use only these existing tabs:

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

Do not add new tabs.

## Required Config rows

Confirm these rows exist in `Config`:

```txt
WEB_APP_URL = https://script.google.com/macros/s/AKfycbyzg1NZxxv0VQUEtK9H7yhoq2tPcTbhBsh9SiYnJDUbXXz6pnfMVndYCgIESN7eLWHG/exec
DRIVE_DOCUMENTS_FOLDER_ID = 1tkny64DDcoIXYuuVhOIeWxN2KS6U89EL
MARKET_DATA_PROVIDER = TIINGO
MARKET_DATA_CACHE_MINUTES = 15
MONTHLY_REPORT_DAY = 15
MONTHLY_REPORT_HOUR_ET = 9
MONTHLY_REPORT_AUTO_SEND = FALSE
PORTAL_DOMAIN = https://corporate.cook-international.com/portal/
```

## Apps Script Properties

Do not put private keys in the sheet or website.

Set:

```txt
TIINGO_API_KEY = your Tiingo token
```

## appsscript.json

Use the included `appsscript.json`. It uses:

- `America/New_York`
- V8 runtime
- Sheets scope
- Drive scope
- external request scope
- send mail scope
- script trigger scope
- Drive Advanced Service v2 only

Do not include both Drive v2 and Drive v3 under the same `Drive` userSymbol.

## Advanced Drive Service

In Apps Script:

```txt
Services -> + -> Drive API
```

Enable Drive API. The manifest in this build is configured for Drive API v2.

## Drive Vault Sync

The portal can now sync manually uploaded files from the configured Drive folder.

Backend action:

```txt
syncDriveVaultDocuments
```

Manual Apps Script function:

```js
CSC_manualSyncDriveVaultDocuments()
```

Portal button:

```txt
Settings -> Sync Drive Vault
Documents -> Sync Drive Vault
```

The sync function:

- opens the Drive folder from `DRIVE_DOCUMENTS_FOLDER_ID`
- scans each file
- checks whether `drive_file_id` already exists in `Documents`
- creates missing `Documents` rows
- marks synced files as `status = synced_from_drive`
- marks synced files as `uploaded_by = drive_sync`
- auto-classifies obvious file types
- creates `Statements` rows for statement/report files
- logs sync activity to `Logs.raw_payload_json`

## Document classification

Admins can classify/update:

```txt
title
category
document_type
status
related_account_id
related_report_id
notes
```

Allowed document types:

```txt
company_document
operating_agreement
investor_packet
budget
bank_statement
fidelity_statement
brokerage_statement
report_pdf
tax_cpa
signed_document
esign_document
other
```

Allowed statuses:

```txt
uploaded
synced_from_drive
classified
parsed
needs_review
approved
archived
```

## Statement parsing

Statement parsing is conservative. It attempts Drive/Google Docs OCR/text extraction when available, stores summary results in `Statements.parsed_summary`, and stores detailed debug information in `Logs.raw_payload_json`.

No extra parsing tabs are created.

If parsing fails, is low-confidence, or totals cannot be validated, the statement remains:

```txt
parsed_status = needs_review
```

The report then remains:

```txt
status = pending_review
```

## 15th-to-15th reports

Reports now use a 15th-to-15th period.

Example:

```txt
Report generated: 15 June 2026
Period start: 15 May 2026
Period end: 15 June 2026
```

Report title format:

```txt
Cook Services Company Monthly Investor Report - [period start] to [period end]
```

## Report inputs

Reports read existing tabs only:

```txt
Accounts
Positions
Transactions
MarketPrices
MarketHistory
Statements
Documents
BusinessUpdates
Budget
CapitalContributions
MemberLedger
```

Reports include:

- executive summary
- 15th-to-15th period
- portfolio snapshot
- cash/bank summary
- Fidelity/brokerage summary
- owned holdings
- research-only watchlist
- cost basis review
- unrealized gain/loss summary
- budget summary
- capital contribution summary
- documents/statements used
- statement parsing status
- exceptions / needs review
- business updates
- risk and compliance notes

## Approval rule

Generated reports default to:

```txt
pending_review
```

Final investor emails send only when the report is:

```txt
approved
approved_with_exceptions
```

If pending review, the final investor email does not send.

## Branded emails

Monthly report emails now use:

```txt
replyTo: cookservicescompany@gmail.com
```

The email shell includes:

- CSC Investments logo
- dark CSC header
- gold portal button
- footer contact block
- corporate.cook-international.com link

## Portal testing checklist

1. Replace `/portal/index.html`.
2. Paste `CSC_PORTAL_BACKEND_v1.6.0_Beta.gs` into Apps Script.
3. Replace `appsscript.json`.
4. Enable Drive API service.
5. Redeploy Apps Script as:
   - Execute as: Me
   - Who has access: Anyone
6. Run `CSC_manualSyncDriveVaultDocuments()`.
7. Open `/portal/`.
8. Login as Michael.
9. Go to Documents.
10. Click Sync Drive Vault.
11. Confirm manually uploaded files appear.
12. Classify a file.
13. Parse a statement.
14. Generate a report.
15. Confirm report period is 15th-to-15th.
16. Approve a report.
17. Send approved report.
18. Confirm EmailLog records the send.

## Important safety notes

- This portal creates management reports, not audited financial statements.
- Never rely on OCR/extracted statement data without review.
- Never allow TradingView widget values to become accounting source-of-truth.
- Research-only positions never count toward portfolio totals.
- Cost basis, quantity, and ownership status remain CSC record fields only.

Last Updated: 22 May 2026 @ 02:19:59Z UTC  
Developed by Cook Technology Services
Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.
End of README
