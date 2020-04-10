function testFleet() {
  var startTime = new Date();

  let fleet = new Fleet();
  fleet.load();

  let filter = {
    "status": MotorhomeStatus.INPREPARATION
  }

  fleet.get(filter).forEach((entity) => {
    Logger.log('name=' + entity.name + ' status=' + entity.status);
  });

  var endTime = new Date();
  Logger.log(`It took ${endTime.getTime() - startTime.getTime()} miliseconds.`);
}