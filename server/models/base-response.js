/*
============================================
; Title: base-response.js
; Author: Ace Baugh
; Date: March 29, 2023
; Description: Base response model
============================================
*/

class BaseResponse {
  constructor(httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }

  toObject() {
    return {
      httpCode: this.httpCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toLocaleString('en-US'),
    };
  }
}

module.exports = BaseResponse;
