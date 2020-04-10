function testUtils() {
  var testArray = new Array();
  for (let i = 0; i < 10000; i++) {
    let testObj = {};
    testObj.name = makeLongString(64);
    testObj.description = makeLongString(1024);
    testObj.testDate = new Date();

    testArray.push(testObj);
  }

  var jsonString = JSON.stringify(testArray);

  var startTime = new Date();

  let result = JSON.parse(jsonString, Utils.dateTimeParsing);

  /*
  let fleet = new Fleet();
  fleet.load();

  let filter = {
    "status": MotorhomeStatus.INPREPARATION
  }

  fleet.get(filter).forEach((entity) => {
    Logger.log('name=' + entity.name + ' status=' + entity.status);
  });
  */

  Logger.log(`Last name=${result[9999].name} and year=${result[9999].testDate.getYear()}`)

  var endTime = new Date();
  Logger.log(`It took ${endTime.getTime() - startTime.getTime()} miliseconds.`);
}

function makeLongString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}