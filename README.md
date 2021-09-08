# Employee Tracker
[![License: GNU GPL v3](https://img.shields.io/badge/License-GNU%20GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Table of Contents
* [Description](#description)
* [Built With](#built-with)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing-to-employee-tracker)
* [Test](#test)
* [Questions](#questions)
* [License](#license)

## Description
This application is a terminal app built with Node.js that simulates an Employee Tracker utilizing a MySql database to store Employee, Department, and Role data. This application supports viewing, updating, adding, and removing employees via Inquirer prompts.

View a demo of this application [here]().

## Built With
- Node.js
- Inquirer.js
- MySql2 NPM Package
- MySql

## Installation
    =============
    = Git Setup =
    =============
	git clone https://github.com/hsengu/employee-tracker.git
	cd ./employee-tracker
	npm install

    ==================
    = MySql DB Setup =
    ==================
    mysql -u your_username -p
    source db/schema.sql
    source db/seeds.sql


## Usage
	npm start

## Contributing to Employee Tracker
Please follow contribution guidelines at the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) to contribute to Employee Tracker.

## Tests
    There are no test available for this application

## Questions
Contact me at the following:
- [hsengu's GitHub Profile](https://github.com/hsengu)
- hok.s.uy@hsengu.com

## License
This project is licensed under GNU GPL v3
