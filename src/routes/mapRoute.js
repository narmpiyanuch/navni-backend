const express = require('express')
const { getDistance, addWorkArea, addSubArea, selectArea, getSubArea } = require('../controller/googleMapController')

const router = express.Router()

router.get('/distance',getDistance)
router.post('/add',addWorkArea)
router.post('/add/sub',addSubArea)
router.post('',selectArea)
router.get('/get-subarea',getSubArea)
module.exports= router