const express = require('express')
const { getDistance, addWorkArea, addSubArea, selectArea, getSubArea, calculate } = require('../controller/googleMapController')

const router = express.Router()

// router.get('/distance',getDistance)
router.post('/add',addWorkArea)
router.post('/add/sub',addSubArea)
router.post('/select-area',selectArea)
router.get('/get-subarea',getSubArea)
router.post('/calculate',calculate)
module.exports= router