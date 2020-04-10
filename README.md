# CaravanConcierge-Intranet
Google Apps Scripts based Intranet, for a Motorhome renting company, [named CaravanConcierge](https://www.caravanconcierge.pt).
This document aims to define the software development guidelines for CaravanConcierge Intranet V2.

[Click here for more informations about CaravanConcierge](https://www.caravanconcierge.pt/).

## Technologies
CC Intranet is based on Google GSuite, namely:
 * Google App Scrips (GAS)
 * Google Sheets
 * Google Drive

## Development tools
The development languague is Javascript (V8).

The recommended IDE is Visual Studio Code, with Clasp tool and Gulp (for automatization).
Alternatively, quick edits and debugging can be performed on Google Could IDE.

The code is hosted at Github.

## Main Entities

### Caravan | Fleet
A **Caravan** represents a renting vehicle. 
A **Fleet** is a group of Caravans.

A **Caravan** is associated with a single owner.

### Owner | Owners
This represents a Caravan **Owner**.
One person can "own" multiple __Caravans__.

### Rent | Rents
A **Rent** is a document (sheet) that holds all the information regarding the rent.

### Customer | Customers


### Staff | Team


### Expense | Expenses


### Task | Tasks

## Development Guidelines
Each Entity includes a single Google Sheet, that includes all elements of that entity. Each individual Entity is located on a separated Sheet.
For example, Rents has a Google Sheet to store all rents, while each individual rent is represented by a specific Sheet.

The Sheet that holds the Entities (e.g. Rents or Fleet), MUST have the following structure:
 - 3 Rows for labels. The data MUST start on row 4.
 - The first column must include the Entity ID (the id of the entity file)
 - The thrid row labels must be exactly the same as the Entity Object properties, but written with _spaces_ instead of PascalCase.
 - The cell B2 MUST contain the date of the last Sync.
 - The cell B1 MUST contain CC logo
 - The cells C1:{end}1 should be merged and have the Entity plural name

Each Entity MUST extend the _BaseEntity_ and set the necessary meta-data, namely:
 * templateId - The ID of the Sheet file that must be used as the template to create and store the entity
 * baseFolderId - Id of the GDrive folder where the Entities are stored
 * entityFileId - The ID of the Sheet file that stores all the entities

 Each Entity must define their own properties and they MUST initialize them on the _readProperties_ and _writeProperties_ arrays.

 ### Define dependencies
 Since some entities may need to access public methods provided by others, we have 2 options:
 A. We use the Google Apps Scripts Libraries
 B. We use SymLinks to the public classes files - using Gulp.

 Since option A is not recommended by Google for large projects, since it will provide a delay, we use option B.

 For that, we use Gulp to create symlinks to all the *.public.js files, from certain entities.

