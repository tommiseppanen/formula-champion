function calculatePoints() {
    var response = UrlFetchApp.fetch("https://ergast.com/api/f1/2021/driverStandings.json");
    var standings = JSON.parse(response);
    var points = standings.MRData.StandingsTable.StandingsLists[0].
      DriverStandings.reduce((accumulator, current) => ({ ...accumulator, [current.Driver.code]: current.points }), {});
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var drivers = sheet.getRange("B2:B11").getValues(); 
  
    let totalPoints = 0;
    for (let i = 0; i < drivers.length; i++) {
      totalPoints += (10-i) * points[drivers[i]];
    }
  
    var resultCell = sheet.getRange("B12"); 
    resultCell.setValue(totalPoints);
  }
  