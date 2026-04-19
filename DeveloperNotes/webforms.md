# Web Sending via Google Sheets Background

This guide outlines exactly how to connect the "Web Sending" function natively built into your Contact and FAQ forms into a live Google Sheet using a highly robust, serverless locking backend!

## 🗂️ Step 1: Prepare Your Google Sheet
1. Go to Google Sheets and create a **Blank Spreadsheet**.
2. Give it a name (e.g., `Luminary Contact Form Logs`).
3. In Row 1, set up your exact column headers from left to right. **CRITICAL:** Because our new custom Apps Script automatically sweeps headers to find matching data, your headers must EXACTLY match the Javascript variable names (case-sensitive):
   - **timestamp**
   - **department**
   - **name**
   - **email**
   - **contactNo**
   - **message**
   - **formatted_message**

*(Note: Ensure there are no leading or trailing spaces in your headers!)*

## 💻 Step 2: Inject The Google Apps Script Backend
1. In your Google Sheet, click on `Extensions` -> `Apps Script` in the top menu.
2. Delete the default `myFunction()` code that appears.
3. **Copy and Paste your requested secure backend router script:**

```javascript
var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
```

4. Click the **Save** icon (floppy disk) at the top.

## 🔑 Step 3: Run the Initial Setup (Crucial)
Because this script uses a secure lock service to prevent multiple simultaneous users from colliding and overwriting each other, it strictly needs authorization first:
1. In the Apps Script editor toolbar, change the select dropdown from `doPost` to **`initialSetup`**.
2. Click the **`▶ Run`** button.
3. Google will immediately throw a popup saying "Authorization Required".
4. Click **Review Permissions** -> Select your Account -> Click **Advanced** -> Click **Go to Untitled Project (unsafe)** -> **Allow**.
5. *Once authorized, the `initialSetup` script will run silently in the background linking your Script to your exact Sheet ID!*

## 🚀 Step 4: Deploy The System
1. In the upper right corner of the Apps Script window, click the blue **Deploy** button.
2. Select **New deployment**.
3. Under "Select type" (gear icon), choose **Web app**.
4. Fill in the data configurations:
   - **Description**: `Contact Engine V1`
   - **Execute as**: `Me (Your Email)` *(CRITICAL: DO NOT set this to User Accessing)*
   - **Who has access**: `Anyone` *(CRITICAL: This allows anonymous site visitors to interact with the script without having to log in to Google!)*
5. Click **Deploy**.
6. Under the Web app URL section, **Copy the long `https://script.google.com/macros/s/.../exec` URL.**

## 🔗 Step 5: Link Frontend variables
1. Return to your workspace and open:
    - `frontend/data/contact_page.json`
    - `frontend/data/faq_contact.json`
2. Replace `"YOUR_GOOGLE_SCRIPT_URL_HERE"` with the massive `/exec` URL you just copied.

Your system is beautifully bonded! Any user who clicks "Send Web" will now instantly trigger the locking sequence, map to your strict header rows, and safely inject the payload!
