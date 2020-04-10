/**
 * This class (namespace) hold the necessary methods to:
 *  - Find new entities from a folder
 *  - Save the entities on a Sheet
 *  - Provide basic APIs to get the Entities with a filter
 *  -
 */
class Entities {
  constructor(entityName, Entity, fileId) {
    if (typeof entityName !== 'string' || entityName.length < 2) {
      throw new Error('Entities: Is is mandatory to provide a valid name for the entities.');
    }
    this.entityName = entityName;

    if (typeof Entity !== 'function') {
      throw new Error('Entities: Is is mandatory to instanciate Entities with a valid entity');
    }
    this.Entity = Entity;

    if (typeof fileId !== 'string') {
      throw new Error('Entities: Is is mandatory to provide a valid file ID.');
    }
    this.fileId = fileId; // The ID of the sheet that holds the Entities

    this.sheet = SpreadsheetApp.openById(this.fileId).getSheets()[0];

    this.entities = [];

    this.folderId = '';

    this.cache = Utils.chunkyCache();

    this.settings = {
      firstDataRow: 3,
      headersCellNotation: 'A3:AB3',
      dataCellNotation: 'A4:AB',
      idsCellsNotaion: 'A3:A',
      lastSyncDateCellNotation: 'B2',
      parseDateTimes: false,
    };
  }

  /**
   * Gets the most recently updated Entities from the Google Drive.
   * And store them internally, on the newAndUpdatedEntities Array Object.
   */
  sync() {
    let syncFilesAfterDate = new Date(2000, 0, 1);

    syncFilesAfterDate = new Date(this.sheet.getRange(this.settings.lastSyncDateCellNotation).getValue());

    this.entities = [];

    const entitiesSubFolders = DriveApp.getFolderById(this.folderId).getFolders();

    while (entitiesSubFolders.hasNext()) {
      const entitiesSubFolder = entitiesSubFolders.next();
      const excelFiles = entitiesSubFolder.getFilesByType('application/vnd.google-apps.spreadsheet');

      while (excelFiles.hasNext()) {
        const excelFile = excelFiles.next();
        const entity = new this.Entity();
        if (excelFile.getLastUpdated() > syncFilesAfterDate && excelFile.getName().match(entity.fileNameRegularExpression)) {
          entity.id = excelFile.getId();
          entity.load();
          if (entity.isLoaded) {
            // Logger.log(excelFile.getName() + "::" + JSON.stringify(entity));
            this.entities.push(entity);
          }
        }
      }
    }
  }

  /**
   * Updates the Entities sheet with the newAndUpdatedEntities entities
   */
  render() {
    const headers = this.sheet.getRange(this.settings.headersCellNotation).getValues();
    const numberOfColumns = headers[0].length;

    const entity = new this.Entity();

    const propertiesColumns = this.extractPropertiesColumns(headers);

    const ids = this.sheet.getRange(this.settings.idsCellsNotaion).getValues();
    const newRows = [];

    this.entities.forEach((entity) => {
      Logger.log(`Lets process entity named ${entity.name}`);

      let rowData = [];
      // If Row already exists
      const index = ids.findIndex((k) => k[0] === entity.id);
      if (index > 0) { // Since it already exists, lets get the existing column values
        rowData = this.sheet.getRange(index + 1, 1, 1, numberOfColumns).getValues();
      } else {
        rowData[0] = new Array(numberOfColumns);
        rowData[0].fill('');
      }

      entity.readProperties.forEach((property) => {
        const propertyLevels = property.split('.');
        switch (propertyLevels.length) {
          case 1:
            rowData[0][propertiesColumns[property]] = entity[propertyLevels[0]];
            break;
          case 2:
            rowData[0][propertiesColumns[property]] = entity[propertyLevels[0]][propertyLevels[1]];
            break;
          case 3:
            rowData[0][propertiesColumns[property]] = entity[propertyLevels[0]][propertyLevels[1]][propertyLevels[2]];
            break;
          default:
            throw new Error('Entities: We do not support properties with more than 3 levels');
        }
      });

      if (index > 0) { // Update
        this.sheet.getRange(index + this.settings.firstDataRow, 1, 1, numberOfColumns).setValues(rowData);

        entity.readFormulasProperties.forEach((property) => {
          this.sheet.getRange(index + this.settings.firstDataRow, propertiesColumns[property] + 1, 1, 1).setFormula(entity[property]());
        });

        this.entityUpdated(entity);
      } else { // Otherwise, create new row
        newRows.push(rowData[0]);

        this.entityCreated(entity);
      }
    });

    // If new rows exist, lets insert them in the end
    if (newRows.length > 0) {
      const LAST_INDEX = ids.findIndex((k) => k[0] !== '');
      this.sheet.getRange(LAST_INDEX + this.settings.firstDataRow + 1, 1, newRows.length, numberOfColumns).setValues(newRows);

      entity.readFormulasProperties.forEach((property) => {
        this.sheet.getRange(LAST_INDEX + this.settings.firstDataRow + 1, propertiesColumns[property] + 1, 1, 1).setFormula(entity[property]());
      });
    }

    if (this.Entities.length > 0) {
      // Since we have new data, lets invalidate the cache
      this.cache.remove(this.entityName);
    }

    // Lets update the date where we made the last Sync, so that the next sync only syncs files after this
    this.sheet.getRange(this.settings.lastSyncDateCellNotation).setValue(new Date().toISOString());
  }

  /**
   * This function is executed every time a new entity is created and added to the Entities sheet
   * @param {Entity} entity
   */
  entityCreated(entity) {
    Logger.log(`We have a new entity, named ${entity.name}`);
  }

  /**
   * This function is executed every time an entity is updated.
   *
   * @param {Entity} entity
   */
  entityUpdated(entity) {
    Logger.log(`The entity, named ${entity.name} was updated.`);
  }

  /**
   * Gets all the Entities, only the basic data, from the Entities sheet.
   * And Stores them on the Entities property
   */
  load() {
    this.entities = [];

    const headers = this.sheet.getRange(this.settings.headersCellNotation).getValues();

    const propertiesColumns = this.extractPropertiesColumns(headers);

    let data = this.cache.get(this.entityName, this.settings.parseDateTimes);

    if (data == null) {
      data = this.sheet.getRange(this.settings.dataCellNotation).getValues();

      this.cache.put(this.entityName, data);
    }

    data.forEach((row) => {
      if (typeof row[propertiesColumns.id] === 'string' && row[propertiesColumns.id].length > 5) {
        const entity = new this.Entity();

        entity.readProperties.forEach((property) => {
          const propertyLevels = property.split('.');
          switch (propertyLevels.length) {
            case 1:
              entity[propertyLevels[0]] = row[propertiesColumns[property]];
              break;
            case 2:
              entity[propertyLevels[0]][propertyLevels[1]] = row[propertiesColumns[property]];
              break;
            case 3:
              entity[propertyLevels[0]][propertyLevels[1]][propertyLevels[2]] = row[propertiesColumns[property]];
              break;
            default:
              throw new Error('Entities: We do not support properties with more than 3 levels');
          }
        });

        this.entities.push(entity);
      }
    });

    this.entities.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });

    // TODO: Add to cache
  }

  /**
   * This internal function is useed to identify which column is representing the property of the Entity object
   *
   * @param {*} headers A 1xn dimension Array where the labels are located
   *
   * @returns An object where each property represents the number of the column where the property is located
   */
  extractPropertiesColumns(headers) {
    const entity = new this.Entity();

    const propertiesColumns = {};

    entity.readProperties.concat(entity.readFormulasProperties).forEach((property) => {
      const column = headers[0].findIndex((k) => Utils.camelize(k).toLowerCase() === property.replace(/\./g, '').toLowerCase());
      if (column >= 0) {
        Object.defineProperty(propertiesColumns, property, {
          value: column,
          enumerable: true,
        });
      }
    });

    return propertiesColumns;
  }

  /**
   * Return a list of Entities that comply with the provided filter.
   * The filter parameter, must be an object. The values can be an Array or single string.
   *
   * @param {object} filter The filter object to be applied.
   */
  get(filter) {
    const filteredEntities = this.entities.filter((item) => {
      for (const key in filter) {
        if (item[key] === undefined || !filter[key].includes(item[key])) {
          return false;
        }
      }
      return true;
    });

    return filteredEntities;
  }
}
