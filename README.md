# Webapp_DMS
Document Management System

### Requirements
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Installation
1. Clone the repository: `git clone https://github.com/aarti-gupta/Webapp_DMS.git`
2. Install the NodeJS dependencies: `npm install`.
3. Install the Bower dependencies: `bower install`.
4. Run the gulp build task: `gulp build`.
5. Run the gulp default task: `gulp`. This will build any changes made automatically, and also run a live reload server on [http://localhost:8888](http://localhost:8888).

### App flow

1. There are four main parts of the App.
    a. Dashboard
        * Upload New Documents
        * Apply Search and Filters
        * Change or Assign Category of a Document
        * Download, Delete Operation
    b. Categories
        * Create, Update, Delete Operation
    c. Un-classified Documents
        * Assign category to a Document
        * Download, Delete Operations
    d. Trash
        * Restore
        * Download
        * Permanent Delete

2. Dashboard related Images

![Dashboard](src/img/to/Dashboard_1.png?raw=true "Title")

