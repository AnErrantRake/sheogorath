//UMNUBC loan system automation script using Google Apps Script
//spreadsheet values are derived from submitted form data - the same form intended to link to the receiveForm function

var LOANER_ID = '1ho8uq1vRXglpGeMjutA5otDhQkvkX7_U9Yprc_UmkxQ';
var EMAIL_SUBJECT = 'UMNUBC Loan Automator - ';
var EMAIL_OWNER = '[owner]@[domain]';
var EMAIL_BODY_SUCCESS = "Our extremely advanced algorithm has identified a potential match!\n" +
                 "One of you (see CC) has an available book, and the other would like to make use of that book.\n" + 
                 "Please reach out to each other to arrange the terms and conditions of your book loan." + 
                   "\n\n\n" +
                 "Thank you for using the Loan Automator, brought to you by UMNUBC!";
var EMAIL_BODY_HAVE = "We have received your submission to loan a book. We will inform you should someone apply to make use of your generous offer." + 
                   "\n\n\n" +
                 "Thank you for using the Loan Automator, brought to you by UMNUBC!";
var EMAIL_BODY_NEED = "We have received your request for a book loan. We will inform you should a third party come forward with a copy of the requested book." + 
                   "\n\n\n" +
                 "Thank you for using the Loan Automator, brought to you by UMNUBC!";
var EMAIL_BODY_DUPLICATE = "We have received your recent form submission. However, our records indicate you have already submitted a form for this book. Please contact the primary book club email for more personal help with your situation." + 
                   "\n\n\n" +
                 "Thank you for using the Loan Automator, brought to you by UMNUBC!";

var EMAIL_KEY = 'Email Address';
var REQUEST_TYPE_KEY = 'Have or Need?';
var REQUEST_TITLE_KEY = 'Book Title';

var DISALLOWED_TITLE = 'TBA'; //kludge to handle special case

var SPREADSHEET;

function receiveForm(event) {
  defCurrentSpreadsheet();
  
  var title_thisMonth = SPREADSHEET.getRange("Metadata!B1").getDisplayValue();
  var title_nextMonth = SPREADSHEET.getRange("Metadata!B2").getDisplayValue();
    
  if(event.namedValues[REQUEST_TITLE_KEY] == title_thisMonth && event.namedValues[REQUEST_TITLE_KEY] != DISALLOWED_TITLE){
    var currentRelevantEmails = SPREADSHEET.getRange("Responses!E2:E").getValues().filter(String);
    
    if(isDuplicate(event.namedValues[EMAIL_KEY],currentRelevantEmails)){
      sendDuplicateNotification(event.namedValues[EMAIL_KEY], 
                                event.namedValues[REQUEST_TITLE_KEY]);
    }
    else{
      processCurrentRequest(event.namedValues[EMAIL_KEY],
                            event.namedValues[REQUEST_TYPE_KEY],
                            event.namedValues[REQUEST_TITLE_KEY]);
    }
    return;
  }
  
  if(event.namedValues[REQUEST_TITLE_KEY] == title_thisMonth && event.namedValues[REQUEST_TITLE_KEY] != DISALLOWED_TITLE){
    var nextRelevantEmails = SPREADSHEET.getRange("Responses!F2:F").getValues().filter(String);
    
    if(isDuplicate(event.namedValues[EMAIL_KEY],nextRelevantEmails)){
      sendDuplicateNotification(event.namedValues[EMAIL_KEY], 
                                event.namedValues[REQUEST_TITLE_KEY]);
    }
    else{
      processNextRequest(event.namedValues[EMAIL_KEY],
                         event.namedValues[REQUEST_TYPE_KEY],
                         event.namedValues[REQUEST_TITLE_KEY]);
    }
    return;
  }
}

function defCurrentSpreadsheet(){
  SpreadsheetApp.flush();
  SPREADSHEET = SpreadsheetApp.openById(LOANER_ID);
}

function processCurrentRequest(email, type, bookTitle){
  if(type == 'Have'){
    var currentNeedAvailable = SPREADSHEET.getRange("Responses!A2:A").getValues().filter(String);
    if(currentNeedAvailable.length > 0){
      sendTransactionEmail(email,currentNeedAvailable[0],bookTitle);
      recordTransaction(email,currentNeedAvailable[0],bookTitle);
    }
    else{
      sendHaveReceipt(email, bookTitle);
      recordReceipt(email,type,bookTitle);
    }
    return;
  }
  
  if(type == 'Need'){
    var currentHaveAvailable = SPREADSHEET.getRange("Responses!B2:B").getValues().filter(String);
    if(currentHaveAvailable.length > 0){
      sendTransactionEmail(currentHaveAvailable[0],email,bookTitle);
      recordTransaction(currentHaveAvailable[0],email,bookTitle);
    }
    else{
      sendNeedReceipt(email, bookTitle);
      recordReceipt(email,type,bookTitle);
    }
    return;
  }
}

function processNextRequest(email, type, bookTitle){
  if(type == 'Have'){
    var nextNeedAvailable = SPREADSHEET.getRange("Responses!C2:C").getValues().filter(String);
    if(currentNeedAvailable.length > 0){
      sendTransactionEmail(email,nextNeedAvailable[0],bookTitle);
      recordTransaction(email,nextNeedAvailable[0],bookTitle);
    }
    else{
      sendHaveReceipt(email, bookTitle);
      recordReceipt(email,type,bookTitle);
    }
    return;
  }
  
  if(type == 'Need'){
    var nextHaveAvailable = SPREADSHEET.getRange("Responses!D2:D").getValues().filter(String);
    if(currentHaveAvailable.length > 0){
      sendTransactionEmail(nextHaveAvailable[0],email,bookTitle);
      recordTransaction(nextHaveAvailable[0],email,bookTitle);
    }
    else{
      sendNeedReceipt(email, bookTitle);
      recordReceipt(email,type,bookTitle);
    }
    return;
  }
}

function recordTransaction(haveEmail,needEmail,bookTitle){
  SPREADSHEET.getSheetByName('Transactions').appendRow([String(haveEmail), String(needEmail), String(bookTitle), (new Date()).toDateString()]); 
}

function recordReceipt(email,type,bookTitle){
  SPREADSHEET.getSheetByName('Receipts').appendRow([String(email), String(type), String(bookTitle), (new Date()).toDateString()]); 
}

function sendTransactionEmail(haveEmail,needEmail,bookTitle){
  MailApp.sendEmail(
    "", //to
    EMAIL_SUBJECT + bookTitle, //subject
    EMAIL_BODY_SUCCESS, //body
    {cc: haveEmail + "," + needEmail, bcc: EMAIL_OWNER} //cc,bcc
  );
}

function sendHaveReceipt(email, bookTitle){
  MailApp.sendEmail(
    email, //to
    EMAIL_SUBJECT + bookTitle, //subject 
    EMAIL_BODY_HAVE //body
  );
}

function sendNeedReceipt(email, bookTitle){
  MailApp.sendEmail(
    email, //to
    EMAIL_SUBJECT + bookTitle, //subject 
    EMAIL_BODY_NEED //body
  );
}

function isDuplicate(email,existingValues){
  Logger.log(email);
  Logger.log(existingValues);
  Logger.log(existingValues.length);
  for (i = 0; i < existingValues.length; i++) { 
    Logger.log(existingValues[i]);
    if(String(existingValues[i]) == String(email)){
      return true;
    }
  }
  return false;
}

function sendDuplicateNotification(email, bookTitle){
  MailApp.sendEmail(
    email, //to
    EMAIL_SUBJECT + bookTitle, //subject 
    EMAIL_BODY_DUPLICATE //body
  );
}
