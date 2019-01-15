from __future__ import print_function
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
import datetime
import requests

# updates the IDed spreadsheet with current date(UTC) and public IP
# requires Google API credentials in the rundir
# largely copypasta from the Google API samples

SPREADSHEET_ID = 'sheetid'
RANGE = 'sheetname!rangeinA1notation'

def credentials():
    # If modifying these scopes, delete the file token.json.
    SCOPES = 'https://www.googleapis.com/auth/spreadsheets'
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    store = file.Storage('token.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        creds = tools.run_flow(flow, store)
    return build('sheets', 'v4', http=creds.authorize(Http()))


def currentIP():
    # returns current public IP for local device
    ip = requests.get('http://ip.42.pl/raw').text
    return [[str(datetime.datetime.utcnow()),ip]]

def main():
    values = currentIP()
    body = {
        'values': values
    }
    service = credentials()
    result = service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID, range=RANGE,
        valueInputOption='USER_ENTERED', body=body).execute()

if __name__ == '__main__':
    main()
