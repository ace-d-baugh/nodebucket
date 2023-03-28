/*
============================================
; Title: item.js
; Author: Ace Baugh
; Date: March 26, 2023
; Description: Item model
============================================
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  text: { type: String },
});

module.exports = itemSchema;
