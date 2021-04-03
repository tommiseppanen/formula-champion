function calculatePoints() {
  var response = UrlFetchApp.fetch("https://ergast.com/api/f1/2021/driverStandings.json");
  var standings = JSON.parse(response);
  var points = standings.MRData.StandingsTable.StandingsLists[0].
    DriverStandings.reduce((accumulator, current) => ({ ...accumulator, [current.Driver.code]: current.points }), {});

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  for (let i = 3; i < 8; i++) {
    var drivers = sheet.getRange(4,i,10).getValues();

    let totalPoints = 0;
    for (let j = 0; j < drivers.length; j++) {
      totalPoints += (10-j) * points[drivers[j]];
    }

    var resultCell = sheet.getRange(3,i); 
    resultCell.setValue(totalPoints);
  }
}
