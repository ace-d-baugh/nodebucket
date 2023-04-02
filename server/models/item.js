/*
============================================
; Title: item.js
; Author: Ace Baugh
; Date: April 2, 2023
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
