const express=require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const middleware = require("../middelware/middleware");

