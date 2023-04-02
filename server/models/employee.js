/*
============================================
; Title: employee.js
; Author: Ace Baugh
; Date: April 2, 2023
; Description: Employee model
============================================
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = require("./item");

// Define the employee schema
let employeeSchema = new Schema(
  {
    // Define the fields
    empId: { type: Number, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    todo: [itemSchema],
    doing: [itemSchema],
    done: [itemSchema],
  },
  // Define the collection
  { collection: "employees" }
);

// Export the model
module.exports = mongoose.model("Employee", employeeSchema);
