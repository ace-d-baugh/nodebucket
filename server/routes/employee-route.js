/*
============================================
; Title: employee-route.js
; Author: Ace Baugh
; Date: April 2, 2023
; Description: Employee route file
============================================
*/

// Require statements
const express = require("express");
const Employee = require("../models/employee");
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const BaseResponse = require("../models/base-response");

// Create the router.
const router = express.Router();
// file path employee-route
const myFile = "employee-route.js";
// Create the ajv object.
const ajv = new Ajv();


// *** Unneeded code ***
/*
const { promisify } = require("util");
const ac = new AbortController();
const {signal} = ac;

const timeout = promisify(setTimeout);

setTimeout(() => {
  ac.abort()
}, 500);

router.get('/:id/alltasks', async (req, res, next) => {
  let empId = req.params.id;
  empId = parseInt(empId);

  if (isNaN(empId)) {
    const err = new Error("Bad Request");
    err.status = 400;
    console.log('isNan error')
    next(err);
    return;
  }

  try {

    const timer = 200;
    await timeout(timer, 'pausing execution', {signal});

    const emp = await Employee.findOne({'empId': req.params.empId})

    if (!emp) {
      res.send(createError(404))
      return;
    }

    res.send(emp);
  } catch (err) {
    if (err.name === 'ABORT_ERR') {
      console.log('ABORT_ERR')
      const err = Error('Abort Error')
      err.status = 500;
      next(err);
      return;
    }
    console.log('catch Error: ')
    next(err);
  }
});


// *** End uneeded code ***
*/


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

// Schema for validating the employee tasks array.
const tasksSchema = {
  type: "object",
  required: ["todo", "doing", "done"],
  additionalProperties: false,
  properties: {
    todo: {
      type: "array",
      additionalProperties: false,
      items: taskSchema,
    },
    doing: {
      type: "array",
      additionalProperties: false,
      items: taskSchema,
    },
    done: {
      type: "array",
      additionalProperties: false,
      items: taskSchema,
    },
  },
};

// Function to get the task from the tasks array.
function getTask(id, tasks) {
  const task = tasks.find(item => item._id.toString() === id);
  return task;
}

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
      const emp = await Employee.findOne({ empId: empId }, "empId todo doing done");

      // If the employee is found.
      if (emp) {
        // Log the employee to the console.
        console.log('This is amazing: ', emp);
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
          // Store the new task Id in a variable.
          const task = result.todo.pop();
          // Create a new BaseResponse object.
          const newTaskResponse = new BaseResponse(
            201,
            "Task item added successfully",
            { id: task._id }
          );
          // Send the new taskResponse to the client.
          res.status(201).send(newTaskResponse);
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

// Swagger written in YAML code to describe the updateTask API

router.put("/:empId/tasks", async (req, res, next) => {
  // Get the employee id from the request.
  let empId = req.params.empId;
  // Get the task id from the request.
  empId = parseInt(empId, 10);

  // Check if the employee Id is a number.
  if (isNaN(empId)) {
    const err = Error("input must be a number");
    err.status = 400;
    console.error("req.params.empId must be a number. unlike: ", empId);
    errorLogger({ filename: myFile, message: `input must be a number: ${empId}`});
    next(err);
    return
  }

  // Get the task id from the request.
  try {
    let emp = await Employee.findOne({'empId': empId})

    // If the employee is not found.
    if (!emp) {
      console.error(createError(404));
      errorLogger({ filename: myFile, message: createError(404)});
      next(createError(404));
      return
    }

    const tasks = req.body;
    const validator = ajv.compile(tasksSchema);
    const valid = validator(tasks);

    // If the tasks are not valid.
    if (!valid) {
      const err = Error("Bad Request");
      err.status = 400;
      console.error("Bad Request. Unable to validate req.body against defined tasksSchema");
      errorLogger({
        filename: myFile,
        message:
          "Bad Request. Unable to validate req.body against defined tasksSchema",
      });
      next(err);
      return
    }

    // Update the employee's tasks
    emp.set({
      todo: req.body.todo,
      doing: req.body.doing,
      done: req.body.done,
    });

    // Save the employee to the database.
    const result = await emp.save();
    console.log(result);
    debugLogger({ filename: myFile, message: result });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Swagger written in YAML code to describe the deleteTask API
router.delete("/:empId/tasks/:taskId", async (req, res, next) => {

  let taskId = req.params.taskId;
  let empId = req.params.empId;
  empId = parseInt(empId, 10);

  // Check if the employee Id is a number.
  if (isNaN(empId)) {
    const err = Error("input must be a number");
    err.status = 400;
    console.error("req.params.empId must be a number. unlike: ", empId);
    errorLogger({ filename: myFile, message: `input must be a number: ${empId}`});
    next(createError(400));
    return
  }

  try {
    let emp = await Employee.findOne({ 'empId': empId });

    // If the employee is not found.
    if (!emp) {
      next(createError(404));
      console.error(createError(404));
      errorLogger({ filename: myFile, message: createError(404)});
      next(err);
      return
    }

    const todoTask = getTask(taskId, emp.todo);
    const doingTask = getTask(taskId, emp.doing);
    const doneTask = getTask(taskId, emp.done);

    if (todoTask !== undefined) {
      emp.todo.id(todoTask._id).remove();
    }

    if (doingTask !== undefined) {
      emp.doing.id(doingTask._id).remove();
    }

    if (doneTask !== undefined) {
      emp.done.id(doneTask._id).remove();
    }

    if (todoTask === undefined && doingTask === undefined && doneTask === undefined) {
      next(createError(404));
      console.error('TaskId not found: ', taskId);
      errorLogger({ filename: myFile, message: `TaskId not found:  ${taskId}`});
      next(err);
      return
    }

    const result = await emp.save();
    debugLogger({ filename: myFile, message: result });
    res.status(204).send();

  } catch (err) {
    next(err);
  };
});

//export the router.
module.exports = router;
