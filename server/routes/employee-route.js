/*
============================================
; Title: employee-route.js
; Author: Ace Baugh
; Date: March 15, 2023
; Description: Employee route
============================================
*/

// Require statements
const express = require('express');
const Employee = require('../models/employee');

// Create the router.
const router = express.Router();

//find employee by id
router.get('/:id', async(req, res, next) => {

  // Get the employee id from the request.
  let empId = req.params.id;
  empId = parseInt(empId, 10);

  if (isNaN(empId)) {
    // Log the error to the console.
    const err = new Error('Bad Request');
    // Set the status code to 400.
    err.status = 400;
    // Log the error to the console.
    console.error('empId is not a number', err.message)
    next(err);  // Send the error to the next middleware.
  } else {

    // Find the employee by id.
    Employee.findOne({'empId': req.params.id}, function(err, emp) {
      if (err) {
        // Log the error to the console.
        console.error('MongoDB Error:', err);
        // Send the error to the next middleware.
        next(err);
      } else {
        // Log the employee to the console.
        console.log('emp', emp);
        // Send the employee to the client.
        res.send(emp);
      }
    })
  }
});

//export the router.
module.exports = router;
