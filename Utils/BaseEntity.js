/**
 * This is the base Class to represent a base Entity.
 * It uses GSuite SpreadsheetApp to store data.
 * And also depends on DriveApp.
 *
 * Each Entity created MUST be an extension of this.
 */
class BaseEntity {
  constructor() {
    this.id = null;
    this.name = '';

    this.templateId = null; // Id of the GSheet file that represents the template
    this.baseFolderId = null; // Id of the GDrive folder where the Entities are stored
    this.entityFileId = null; // The ID of the Sheet file that stores all the entities

    this.fileNameRegularExpression = /.*/i; // Regular expression that validates if an Entity file has a valid name

    this.settings = {
      templateSheetData: [
        {
          name: 'Details',
          cellNotation: 'A2:B',
          labelColumnNumber: 0,
          valuesColumnNumber: 1,
        },
      ],
    };

    this.readProperties = ['id', 'name', 'lastUpdate'];

    this.writeProperties = ['name', 'lastUpdate'];

    this.readFormulasProperties = ['link'];

    this.isLoaded = false;

    this.isSaved = false;

    this.lastUpdate = new Date(1970, 0, 1);
  }

  getUrl() {
    return "https://docs.google.com/spreadsheets/d/" + this.id + "/";
  }

  link(friendlyName) {
    if (typeof friendlyName != 'string' || friendlyName == "") {
      friendlyName = "File";
    }
    return '=HYPERLINK("' + this.getUrl() + '";"' + friendlyName + '")'
  }

  /**
   * This function loads the data from a Google Sheet
   *
   * @returns {boolean} If successed or fail.
   */
  load() {
    if (this.id === null) {
      throw new Error('Error loading data. The id is not specified.');
    }
    // Open the SpreadSheet
    const spreadsheet = SpreadsheetApp.openById(this.id);
    if (spreadsheet === null) {
      throw new Error(`We couldn't load the spreadsheet with id ${this.id}`);
    }

    this.settings.templateSheetData.forEach((sheetData) => {
      // Open the sheet (what is the name of the sheet or sheets?)
      const sheet = spreadsheet.getSheetByName(sheetData.name);
      if (spreadsheet === null) {
        throw new Error(`We couldn't find the Sheet named ${sheetData.name} for the the spreadsheet with id ${this.id}`);
      }

      // Read all the data
      const data = sheet.getRange(sheetData.cellNotation).getValues();

      this.readProperties.forEach((property) => {
        // Lets search if the property exists on the data label
        // Here is the trick: we compare the Sheet label, converting to camel case
        // , with the property name, without the .
        const row = data.find((k) => Utils.camelize(k[sheetData.labelColumnNumber]).toLowerCase() === property.replace(/\./g, '').toLowerCase());
        if (Array.isArray(row)) {
          // If exists, assign the object property to the value
          const propertyLevels = property.split('.');
          switch (propertyLevels.length) {
            case 1:
              this[propertyLevels[0]] = row[sheetData.valuesColumnNumber];
              break;
            case 2:
              this[propertyLevels[0]][propertyLevels[1]] = row[sheetData.valuesColumnNumber];
              break;
            case 3:
              this[propertyLevels[0]][propertyLevels[1]][propertyLevels[2]] = row[sheetData.valuesColumnNumber];
              break;
            default:
              throw new Error('BaseEntity: We do not support properties with more than 3 levels');
          }
        }
      });
    });

    this.lastUpdate = DriveApp.getFileById(this.id).getLastUpdated();

    this.isLoaded = true;
  }

  /**
     * This function updates the data on the Entity a Google Sheet
     *
     * @returns {boolean} If successed or fail.
     */
  update() {
    if (this.id === null) {
      throw new Error('Error updating data. The id is not specified.');
    } else {
      // Open the SpreadSheet
      const spreadsheet = SpreadsheetApp.openById(this.id);
      if (spreadsheet === null) {
        throw new Error(`We couldn't update the spreadsheet with id ${this.id}`);
      }

      this.lastUpdate = new Date();

      this.settings.templateSheetData.forEach((sheetData) => {
        const sheet = spreadsheet.getSheetByName(sheetData.name);
        if (spreadsheet === null) {
          throw new Error(`We couldn't find the Sheet named ${sheetData.name} for the the spreadsheet with id ${this.id}`);
        }

        // Read all the data
        const data = sheet.getRange(sheetData.cellNotation).getValues();
        const formulas = sheet.getRange(sheetData.cellNotation).getFormulas();

        this.writeProperties.forEach((property) => {
          // Lets search if the property exists on the data label (1st column)
          const rowIndex = data.findIndex((k) => Utils.camelize(k[sheetData.labelColumnNumber]).toLowerCase() === property.replace(/\./g, '').toLowerCase());

          if (rowIndex >= 0) {
            // If exists, update the assign the object property to the value (2nd column)
            data[rowIndex][sheetData.valuesColumnNumber] = this[property];

            const propertyLevels = property.split('.');
            switch (propertyLevels.length) {
              case 1:
                data[rowIndex][sheetData.valuesColumnNumber] = this[propertyLevels[0]];
                break;
              case 2:
                data[rowIndex][sheetData.valuesColumnNumber] = this[propertyLevels[0]][propertyLevels[1]];
                break;
              case 3:
                data[rowIndex][sheetData.valuesColumnNumber] = this[propertyLevels[0]][propertyLevels[1]][propertyLevels[2]];
                break;
              default:
                throw new Error('BaseEntity: We do not support properties with more than 3 levels');
            }
          }
        });

        sheet.getRange(sheetData.cellNotation).setValues(data);

        const startRow = parseInt(sheetData.cellNotation.match(/\d{1,3}/i)[0]);

        const formulasLength = formulas.length;
        for (let i = 0; i < formulasLength; i += 1) {
          if (typeof formulas[i][sheetData.labelColumnNumber] === 'string' && formulas[i][sheetData.valuesColumnNumber].length > 5) {
            sheet.getRange(startRow + i, sheetData.valuesColumnNumber + 1).setFormula(formulas[i][sheetData.valuesColumnNumber]);
          }
        }
      });

      this.isSaved = true;
    }
  }

  /**
     * This function creates a new Google Sheet, based on the TemplateId, to store all the Entity data
     *
     * @returns {boolean} If successed or fail.
     */
  create() {
    if (this.id != null) {
      throw new Error(`Error creating Entity. The entity already exists with id ${this.id}.`);
    } else {
      // Creates the Entity Folder
      const entitiesFolder = DriveApp.getFolderById(this.baseFolderId);

      // Lets check if a folder already exists
      const possibleFolders = entitiesFolder.getFoldersByName(this.name);
      let entityFolder;
      if (possibleFolders.hasNext()) {
        entityFolder = possibleFolders.next();
      } else {
        entityFolder = entitiesFolder.createFolder(this.name);
      }

      // Creates the Entity File
      // Lets check if the entity File already exists:
      const possibleFiles = entityFolder.getFilesByName(this.name);
      let entityFile;
      if (possibleFiles.hasNext()) {
        entityFile = possibleFiles.next();
      } else {
        entityFile = DriveApp.getFileById(this.templateId).makeCopy(this.name, entityFolder);
      }

      this.id = entityFile.getId();

      this.update();
    }
  }
}