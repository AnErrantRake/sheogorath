var FORM_ID = [SpreadsheetID as 'String'];
var METADATA_SHEET_NAME = 'Metadata';
var FORM_BOOKTITLE_ITEM_ID = [FORM ID as Int];

//if spreadsheet is edited, updates form to reflect changes
function onEdit(e){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var metadata = spreadsheet.getSheetByName(METADATA_SHEET_NAME);
  var title_thisMonth = metadata.getRange(1, 2).getDisplayValue();
  var title_nextMonth = metadata.getRange(2, 2).getDisplayValue();
  var form = FormApp.openById(FORM_ID);
  var bookTitleItem = form.getItemById(FORM_BOOKTITLE_ITEM_ID).asListItem();
  bookTitleItem.setChoices([bookTitleItem.createChoice(title_thisMonth),
                            bookTitleItem.createChoice(title_nextMonth)]);
  
}
