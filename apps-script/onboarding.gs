/**
 * ClinicRelay founding-clinic onboarding -> Google Sheet.
 *
 * Setup: open the Sheet -> Extensions -> Apps Script -> paste this file -> Deploy -> New deployment
 * -> type "Web app", Execute as "Me", Who has access "Anyone" -> copy the /exec URL into
 * .env (or the repo Variable) as ONBOARDING_ENDPOINT. Re-deploy (Manage deployments -> edit -> new version)
 * after changing this code.
 *
 * Not served by the site; versioned here alongside the form.
 */
var SHEET_NAME = "Onboarding";
var COLUMNS = [
  "submitted_at", "phone", "doctor_name", "role", "clinic_name", "city", "specialty", "doctors",
  "staff", "patients_per_day", "current_tools", "priorities", "languages", "setup_time", "notes",
  "razorpay_payment_id", "razorpay_payment_link_id", "razorpay_payment_link_status", "page"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.getActive().insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS.concat(["received_at"]));
    var p = (e && e.parameter) || {};
    var row = COLUMNS.map(function (c) {
      var v = String(p[c] || "").slice(0, 1000);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // block spreadsheet formula injection
    });
    row.push(new Date());
    sheet.appendRow(row);
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
