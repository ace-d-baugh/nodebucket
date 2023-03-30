/*
============================================
; Title: logger.js
; Author: Ace Baugh
; Date: March 29, 2023
; Description: this is a simple logger
============================================
*/

// Require statements
const { appendFileSync } = require("fs");
const { join } = require("path");

// log locations
const debugLog = join(__dirname, "debug.log");
const errorLog = join(__dirname, "error.log");

// get date and time
const getDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-US");
};

// export functions for logging to debug logs
module.exports.debugLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${
    data.message
  }\n`;
  appendFileSync(debugLog, logString);
};

// export functions for logging to error logs
module.exports.errorLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${
    data.message
  }\n`;
  appendFileSync(errorLog, logString);
};
