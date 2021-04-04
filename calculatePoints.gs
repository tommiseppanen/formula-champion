function calculatePoints() {
  let races = getRaceResults();
  let sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  let points = new Array(5).fill(0);
  for (let raceIndex = 0; raceIndex < races.length; raceIndex++)
  {
    for (let playerIndex = 0; playerIndex < points.length; playerIndex++) 
    {
      let drivers = getDriversFromPlayersRow(raceIndex, playerIndex, sheets[0], sheets[1]);
      let racePoints = 0;
      for (let j = 0; j < drivers.length; j++) {
        racePoints += (10-j) * races[raceIndex][drivers[j]];
      }
      points[playerIndex] += racePoints;
    }
  }

  outputPoints(points, sheets[0]);
}

function getRaceResults()
{
  let response = UrlFetchApp.fetch("https://ergast.com/api/f1/2021/results.json?limit=400");
  let standings = JSON.parse(response);
  return standings.MRData.RaceTable.Races.map(race => race.Results.reduce((accumulator, result) => ({ ...accumulator, [result.Driver.code]: result.points }), {}));
}

function getDriversFromPlayersRow(raceIndex, playerIndex, rowsSheet, calendarSheet)
{
  let rowOffset = (calendarSheet.getRange(2+raceIndex,playerIndex+3).getValues()-1)*10;
  return rowsSheet.getRange(3+rowOffset,playerIndex+3,10).getValues();
}

function outputPoints(points, outputSheet)
{
  for (let i = 0; i < points.length; i++) {
    let resultCell = outputSheet.getRange(2,3+i); 
    resultCell.setValue(points[i]);
  }
}
