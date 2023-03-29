/*
============================================
; Title: employee-route.js
; Author: Ace Baugh
; Date: March 26, 2023
; Description: Employee route file
============================================
*/

// Require statements
const express = require("express");
const Employee = require("../models/employee");
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");

// Create the router.
const router = express.Router();
// file path employee-route
const myFile = "employee-route.js";
// Create the ajv object.
const ajv = new Ajv();

// Function to check if the id is a number.
const checkNum = (id) => {
  id = parseInt(id, 10);

  // Check if the employee id is a number.
  if (isNaN(id)) {
    // Log the error to the console.
    const err = new Error("Bad Request");
    // Set the status code to 400.
    err.status = 400;
    return err;
  } else {
    return false;
  }
};

// Schema for validating the employee.
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
};

// Swagger written in YAML code to describe the findEmployeeById API
/**
 * findEmployeeById
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning employees by employeeId
 *     summary: returns employee by employeeId
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Employees ID
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '401':
 *         description: Invalid employeeId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
// Find employee by id
router.get("/:id", (req, res, next) => {
  // Get the employee id from the request.
  let empId = req.params.id;

  const err = checkNum(empId);

  if (err === false) {
    // Find the employee by id.
    Employee.findOne({ empId: req.params.id }, function (err, emp) {
      if (err) {
        // Log the error to the console.
        console.error("MongoDB Error:", err);
        errorLogger({
          filename: myFile,
          message: `MongoDB Error: ${err.message}`,
        });
        // Send the error to the next middleware.
        next(err);
      } else {
        // Log the employee to the console.
        console.log("emp:", emp);
        debugLogger({ filename: myFile, message: emp });
        // Send the employee to the client.
        res.send(emp);
      }
    });
  } else {
    // Log the error to the console.
    console.error("id could not be parsed", empId);
    errorLogger({
      filename: myFile,
      message: `empId could not be parsed: ${empId}`,
    });
    // Send the error to the next middleware.
    next(err);
  }
});

// Swagger written in YAML code to describe the findAllTasks API
/**
 * findAllTasks
 * @openapi
 * /api/employees/{id}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for viewing all tasks for an employee
 *     summary: view all tasks for an employee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: OK Successful query
 *       '400':
 *         description: Bad Request route.params.id is not a number
 *       '404':
 *         description: Not Found MondoDB returns null record; employee not found
 *       '500':
 *         description: Internal Server Error for everything else
 */
router.get("/:empId/tasks", async (req, res, next) => {
  // Get the employee id from the request.
  let empId = req.params.empId;
  const err = checkNum(empId);

  // If the employee id is a number.
  if (err === false) {
    try {
      // Find the employee by id.
      const emp = await Employee.findOne({ empId: empId }, "empId todo done");

      // If the employee is found.
      if (emp) {
        // Log the employee to the console.
        console.log(emp);
        // Update the debug log.
        debugLogger({ filename: myFile, message: emp });
        // Send the employee to the client.
        res.send(emp);
        // If the employee is not found.
      } else {
        // Log the error to the console.
        console.error(createError(404));
        // Update the error log.
        errorLogger({ filename: myFile, message: createError(404) });
        // Send the error to the next middleware.
        next(createError(404));
      }
      // Catch any errors.
    } catch (err) {
      // Log the error to the error log.
      errorLogger({ filename: myFile, message: err });
      // Send the error to the next middleware.
      next(err);
    }
    // If the employee id is not a number.
  } else {
    // create error string for logging
    const errorString = `empId is not a number: ${empId}`;
    // Log the error to the console.
    console.error(errorString);
    // Update the error log.
    errorLogger({
      filename: myFile,
      message: errorString,
    });
    // Send the error to the next middleware.
    next(err);
  }
});

// Swagger written in YAML code to describe the createTask API
/**
 * createTask
 * @openapi
 * /api/employees/{id}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     description:  API for creating a task for an employee
 *     summary: creates a task for an employee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Task Text
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '204':
 *         description: Task created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 */
router.post("/:empId/tasks", async (req, res, next) => {
  // Get the employee id from the request.
  let empId = req.params.empId;

  // Check if the employee Id is a number.
  const err = checkNum(empId);

  // If the employee id is a number.
  if (err === false) {
    try {
      // Find the employee by id.
      let emp = await Employee.findOne({ empId: empId });

      // If the employee is found.
      if (emp) {
        // store the new task in a variable
        const newTask = req.body;
        // Validate the new task against the taskSchema
        const validator = ajv.compile(taskSchema);
        // If the new task is valid.
        const valid = validator(newTask);

        // If the new task is not valid.
        if (!valid) {
          // Store the error message
          const err = Error("Bad Request");
          // Set the status code
          err.status = 400;
          // Log the error to the console.
          console.error(
            "Bad Request. Unable to validate req.body against defined schema"
          );
          // Update the error log.
          errorLogger({ filename: myFile, message: err });
          // Send the error to the next middleware.
          next(err);
        } else {
          // Add the new task to the employee's todo array.
          emp.todo.push(newTask);
          // Save the employee to the database.
          const result = await emp.save();
          // Log the result to the console.
          console.log(result);
          // Update the debug log.
          debugLogger({ filename: myFile, message: result });
          // Send the new task to the client.
          res.status(204).send(newTask);
        }
      } else {
        // Log the error to the console.
        console.log("empId is a number, but not an employee");
        // Log the error to the console.
        console.error(createError(404));
        // Update the error log.
        errorLogger({ filename: myFile, message: createError(404) });
        // Send the error to the next middleware.
        next(createError(404));
      }
    } catch (err) {
      // Send the error to the next middleware.
      next(err);
    }
  } else {
    // Log the error to the console.
    console.error("req.params.empId must be a number. unlike: ", empId);
    // Update the error log.
    errorLogger({
      filename: myFile,
      message: `req.params.empId must be a number ${empId}`,
    });
    // Send the error to the next middleware.
    next(err);
  }
});

// Swagger written in YAML code to describe the deleteTask API
/**
 * deleteTask
 * @openapi
 * /api/employees/{id}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     description: API for deleting a task for an employee
 *     summary: deletes a task for an employee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Task deleted
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete("/:empId/tasks/:taskId", async (req, res, next) => {
  // Get the employee id from the request.
  let empId = req.params.empId;
  let taskId = "";

  const err = checkNum(empId);

  if (err === false) {
    try {

    } catch (err) {
      next(err);
    }
  } else {
    console.error("req.params.empId must be a number. unlike: ", empId);
    errorLogger({
      filename: myFile,
      message: `req.params.empId must be a number ${empId}`,
    });
    next(err); // Send the error to the next middleware.
  }
});


//export the router.
module.exports = router;
