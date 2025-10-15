class SheetController {

  static getCardInfoSheet() {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("カード情報");
  }

  static getUsageDetailSheet() {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("利用明細");
  }

  static getUpdateSheet() {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("更新情報");
  }

  // 更新情報

  static get UPDATE_INFO_COLUMN_LAST_DATE() {
    return 3;
  }

  static updateLastDate(index, dateOfUse) {
    let sheet = SheetController.getUpdateSheet();
    let latestDateOfUseCell = sheet.getRange(parseInt(index) + 2, SheetController.UPDATE_INFO_COLUMN_LAST_DATE);
    latestDateOfUseCell.setValue(dateOfUse);
  }

  static getLastRow() {
    let sheet = SheetController.getUpdateSheet();
    return sheet.getLastRow();
  }

  static getAllSubjects() {
    let sheet = SheetController.getUpdateSheet();
    let lastRow = sheet.getLastRow();
    let subjects = [];
    for (let i = 2; i <= lastRow; i++) {
      subjects.push({
        brand: sheet.getRange(i, 1).getValue(),
        subject: sheet.getRange(i, 2).getValue(),
        last_date: sheet.getRange(i, 3).getValue(),
        type: sheet.getRange(i, 4).getValue(),
      });
    }
    return subjects;
  }

  // 利用明細

  static get USAGE_DETAIL_COLUMN_CARD() {
    return 3;
  }
  
  static get USAGE_DETAIL_COLUMN_STORE() {
    return 4;
  }

  static get USAGE_DETAIL_COLUMN_TRANSACTION() {
    return 5;
  }

  static insertDataToSheet(data) {
    let sheet = SheetController.getUsageDetailSheet();
    let newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1).setValue(data.dateOfUse);
    sheet
      .getRange(newRow, 2)
      .setValue(data.price.replace("円", "").replace(",", ""));
    sheet.getRange(newRow, SheetController.USAGE_DETAIL_COLUMN_CARD).setValue(data.card);
    sheet.getRange(newRow, SheetController.USAGE_DETAIL_COLUMN_STORE).setValue(data.store);
    sheet.getRange(newRow, SheetController.USAGE_DETAIL_COLUMN_TRANSACTION).setValue(data.transaction);
  }

  // カード情報

  static get CARD_INFO_COLUMN_TOTAL() {
    return 2;
  }
  static get CARD_INFO_COLUMN_BRAND() {
    return 6;
  }
  static get CARD_INFO_COLUMN_EMOJI() {
    return 7;
  }

  static getCardRowData(card_name) {
    let sheet = SheetController.getCardInfoSheet();
    let lastRow = sheet.getLastRow();
    for (let i = 2; i <= lastRow; i++) {
      if (sheet.getRange(i, 1).getValue() === card_name) {
        return {
          total: sheet.getRange(i, SheetController.CARD_INFO_COLUMN_TOTAL).getDisplayValue(),
          brand: sheet.getRange(i, SheetController.CARD_INFO_COLUMN_BRAND).getDisplayValue(),
          emoji: sheet.getRange(i, SheetController.CARD_INFO_COLUMN_EMOJI).getDisplayValue(),
        };
      }
    }
    return null;
  }

  static getTotalPrice() {
    let sheet = SheetController.getCardInfoSheet();
    let total = sheet.getRange(2, 2).getDisplayValue();
    return total;
  }
};
