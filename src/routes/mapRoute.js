const express = require('express')
const { getDistance, addWorkArea, addSubArea, selectArea, getSubArea, calculate, getWorkArea, editStationName, changeStatus } = require('../controller/googleMapController')

const router = express.Router()

// router.get('/distance',getDistance)
router.post('/add',addWorkArea)
router.post('/add/sub',addSubArea)
router.post('/select-area',selectArea)
router.get('/get-area',getWorkArea)
router.get('/get-subarea',getSubArea)
router.post('/calculate',calculate)
router.post('/edit-station-name',editStationName)
router.post('/status',changeStatus)
module.exports= router