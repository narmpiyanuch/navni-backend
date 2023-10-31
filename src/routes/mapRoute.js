const express = require('express')
const { getDistance } = require('../controller/googleMapController')

const router = express.Router()

router.get('/distance',getDistance)

module.exports= router