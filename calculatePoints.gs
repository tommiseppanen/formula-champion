function calculatePoints() {
  let response = UrlFetchApp.fetch("https://ergast.com/api/f1/2021/results.json?limit=400");
  let standings = JSON.parse(response);
  let races = standings.MRData.RaceTable.Races.map(race => race.Results.reduce((accumulator, result) => ({ ...accumulator, [result.Driver.code]: result.points }), {}));
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];

  let points = new Array(5).fill(0);
  for (let raceIndex = 0; raceIndex < races.length; raceIndex++)
  {
    let rowOffset = 0;
    for (let i = 0; i < points.length; i++) {
      let drivers = sheet.getRange(3+rowOffset,i+3,10).getValues();

      let racePoints = 0;
      for (let j = 0; j < drivers.length; j++) {
        racePoints += (10-j) * races[raceIndex][drivers[j]];
      }

      points[i] = points[i] + racePoints;
    }
  }

  for (let i = 0; i < points.length; i++) {
    let resultCell = sheet.getRange(2,3+i); 
    resultCell.setValue(points[i]);
  }
}