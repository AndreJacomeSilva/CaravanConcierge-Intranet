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

