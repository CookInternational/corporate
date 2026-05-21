[Uploading CSC_PORTAL_REPORTS_DOCUMENTS_README.md…]()
# CSC Portal v1.6.2 Beta - Reports, Documents & Drive Vault | Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.


**Cook Services Company, LLC**  
**Build:** CSC Portal v1.6.2 Beta  
**Updated:** 21 May 2026 @ 23:12:29Z
**Website:** https://corporate.cook-international.com  
**Portal:** https://corporate.cook-international.com/portal/  
**Contact:** cookservicescompany@gmail.com

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

Last Updated: 21 May 2026 @ 23:12:29Z
Developed by Cook Technology Services
Copyright © 2025 Cook Services Company, LLC | All Rights Reserved.
End of README
