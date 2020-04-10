function testEntities() {
  const entity = new BaseEntity();
  entity.id = '1swrLQyQUoV5NqODbBRHHaL388ThgKbtDzsFNACZ48yA';

  entity.templateId = '1_lfdSMoC_e5dyAkTVBc2qVMipNjwkl9FZq3r28Fv0yI';
  entity.baseFolderId = '1pCjD2-hTZhYtwUnoC6owFoD3Yzn6Aqim';

  entity.name = 'New name ' + Math.round(Math.random() * 100);

  entity.complexObject = {
    propertyA: 'PropertyA',
    propertyB: {
      propertyB1: 'PropertyB1',
      propertyB2: 'PropertyB2',
    },
  };

  entity.readProperties.push('complexObject.propertyA', 'complexObject.propertyB.propertyB1', 'complexObject.propertyB.propertyB2');

  entity.writeProperties.push('complexObject.propertyA', 'complexObject.propertyB.propertyB1', 'complexObject.propertyB.propertyB2');

  entity.complexObject.propertyA = "New Property A";
  entity.complexObject.propertyB.propertyB2 = "New property B2";

  entity.update();

  Logger.log('propertyA=' + entity.complexObject.propertyA);
  Logger.log('propertyB1=' + entity.complexObject.propertyB.propertyB1);
  Logger.log('propertyB2=' + entity.complexObject.propertyB.propertyB2);

  Logger.log(`entity.name=${entity.name}`);
}