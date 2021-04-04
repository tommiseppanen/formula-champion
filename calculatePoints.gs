function calculatePoints() {
  let races = getRaceResults();
  let sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  let points = new Array(5).fill(0);
  for (let raceIndex = 0; raceIndex < races.length; raceIndex++)
  {
    for (let i = 0; i < points.length; i++) {
      let rowOffset = (sheets[1].getRange(2+raceIndex,i+3).getValues()-1)*10;
      let drivers = sheets[0].getRange(3+rowOffset,i+3,10).getValues();

      let racePoints = 0;
      for (let j = 0; j < drivers.length; j++) {
        racePoints += (10-j) * races[raceIndex][drivers[j]];
      }

      points[i] = points[i] + racePoints;
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

function outputPoints(points, outputSheet)
{
  for (let i = 0; i < points.length; i++) {
    let resultCell = outputSheet.getRange(2,3+i); 
    resultCell.setValue(points[i]);
  }
}
