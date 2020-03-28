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