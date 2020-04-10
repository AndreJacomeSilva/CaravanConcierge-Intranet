function testEntities() {
  var entities = new Entities('test', BaseEntity, '1VubvdMhLzYXAP72e1sRciJbMtckt7th4kPEV3XVHcvY');
  entities.folderId = '1pCjD2-hTZhYtwUnoC6owFoD3Yzn6Aqim';

  //entities.sync();

  entities.load();

  let filter = {
    "name": [
      "Beni",
      "Marselha"
    ]
  }

  entities.get(filter).forEach((entity) => {
    Logger.log('name=' + entity.name);
  });
}