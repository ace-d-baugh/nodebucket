/*
============================================
; Title: item.js
; Author: Ace Baugh
; Date: March 29, 2023
; Description: Item model
============================================
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the item schema
let itemSchema = new Schema({
  text: { type: String },
});

module.exports = itemSchema;
