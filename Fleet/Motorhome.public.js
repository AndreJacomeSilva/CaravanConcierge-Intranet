const MotorhomeStatus = {
  ACTIVE: 'Active',
  INPREPARATION: 'InPreparation',
  SOLD: 'Sold',
};

/**
 * Motorhome Object
 *
 * @property {date} reservationDate The date on which the rent was closed.
 */
class Motorhome extends BaseEntity {
  constructor() {
    super();

    this.templateId = "1_lfdSMoC_e5dyAkTVBc2qVMipNjwkl9FZq3r28Fv0yI";
    this.baseFolderId = "1pCjD2-hTZhYtwUnoC6owFoD3Yzn6Aqim";

    this.settings = {
      templateSheetData: [
        { name: 'Details', cellNotation: 'A2:B' },
      ],
    };

    this.readProperties.push('status', 'owner');
    this.writeProperties.push('status');

    this.status = MotorhomeStatus.ACTIVE;

    this.reservationDate = new Date();
    this.startDate = null;
    this.endDate = null;

    this.photoUrl = '';

    this.owner = { 'name': '', 'id': '' }; // The name of the Owner;

    this.photoUrl = "";
    this.status = "Active";
    this.rank = 5;

    this.title = "";
    this.subTitle = "";
    this.color = "#DDDDDD";

    this.licencePlate = "xx-xx-xx";
    this.carBrandAndModel = "";
    this.caravanBrandAndModel = "";
    this.year = "";
    this.month = "";
    this.type = "";
    this.configuration = "";
    this.condition = "Acceptable";
    this.equipmentStatus = "Acceptable";

    this.numberOfTravelingSeats = 0;
    this.numberOfSleeps = 0;

    this.length = 0;
    this.height = 0;
    this.width = 0;

    this.chassisIdNumber = "";

    this.engineCC = 2000;
    this.power = 0;
    this.torque = 0;
    this.fuel = "Diesel";
    this.gearbox = "Manual";
    this.fuelConsumption = 11;

    this.tyreSize = "";
    this.tyrePressure = "";

    this.insuranceCompany = "";
    this.insuranceID = "";
    this.insuranceDate = "";
    this.insuranceExpireDate = "";

    this.inspectionDate = "";
    this.nextInspectionDate = "";
    this.iUCPaymentDate = "";

    this.buyDate = "";
    this.startActivityDate = "";
    this.endActivityDate = "";
    this.sellDate = "";

    this.lastReportedKms = "";
    this.nextMechanicRevision = "";
    this.lastSyncDate = "";

    this.statistics = {
      "numberOfRents": 0,
      "totalKmsDriven": 0,
      "totalRepairCosts": 0,
      "daysInActive": 0,
      "costPer100Km": 0,
      "costPerRent": 0
    }
  }

  get numberOfDays() {
    return Math.round((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
  }

  get numberOfNights() {
    return Math.round((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
  }

  logToConsole() {
    Logger.log(`Motorhome(width=${this.name}, height=${this.owner})`);
  }
}

function testThis() {
  const motorhome = new Motorhome('Caravaninha');

  motorhome.startDate = new Date(2020, 2, 20);
  motorhome.endDate = new Date(2020, 2, 29);

  Logger.log(motorhome.numberOfDays);

  Logger.log(motorhome.status);

  motorhome.logToConsole();
}