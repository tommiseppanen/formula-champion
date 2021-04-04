function calculatePoints() {
  const races = getRaceResults();
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  outputPoints(calculatePlayerPoints(races, sheets[0], sheets[1]), sheets[0]);
}

function getRaceResults()
{
  const response = UrlFetchApp.fetch("https://ergast.com/api/f1/2021/results.json?limit=400");
  const standings = JSON.parse(response);
  return standings.MRData.RaceTable.Races.map(race => race.Results.reduce(
    (accumulator, result) => ({ ...accumulator, [result.Driver.code]: result.points }), {}));
}

function calculatePlayerPoints(races, rowsSheet, calendarSheet)
{
  const points = new Array(5).fill(0);
  for (let raceIndex = 0; raceIndex < races.length; raceIndex++)
  {
    for (let playerIndex = 0; playerIndex < points.length; playerIndex++) 
    {
      const drivers = getDriversFromPlayersRow(raceIndex, playerIndex, rowsSheet, calendarSheet);   
      points[playerIndex] += calculatePointsFromRace(races[raceIndex], drivers);
    }
  }
  return points;
}

function getDriversFromPlayersRow(raceIndex, playerIndex, rowsSheet, calendarSheet)
{
  const rowOffset = (calendarSheet.getRange(2+raceIndex,playerIndex+3).getValues()-1)*10;
  return rowsSheet.getRange(3+rowOffset,playerIndex+3,10).getValues();
}

function calculatePointsFromRace(race, drivers)
{
  let racePoints = 0;
  for (let j = 0; j < drivers.length; j++) {
    racePoints += (10-j) * race[drivers[j]];
  }
  return racePoints;
}

function outputPoints(points, outputSheet)
{
  for (let i = 0; i < points.length; i++) {
    const resultCell = outputSheet.getRange(2,3+i); 
    resultCell.setValue(points[i]);
  }
}
