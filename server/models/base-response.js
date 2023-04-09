/*
============================================
; Title: base-response.js
; Author: Ace Baugh
; Date: April 9, 2023
; Description: Base response model
============================================
*/

// Base response model
class BaseResponse {
  constructor(httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }

  // Convert to object
  toObject() {
    return {
      httpCode: this.httpCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toLocaleString("en-US"),
    };
  }
}

module.exports = BaseResponse;
