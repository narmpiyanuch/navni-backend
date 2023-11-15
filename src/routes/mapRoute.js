const express = require('express')
const { getDistance, addWorkArea, addSubArea, selectArea, getSubArea, calculate, getWorkArea, editStationName, changeStatus, changeStatusArea, deleteSubArea, deleteArea } = require('../controller/googleMapController')
const checkAdminMiddleware = require("../middleWare/roleIdentifierMiddleware");
const authenticateMiddleware = require("../middleWare/authenticateMiddleware");
const router = express.Router()

// router.get('/distance',getDistance)
router.post('/add',authenticateMiddleware,checkAdminMiddleware,addWorkArea)
router.post('/add/sub',authenticateMiddleware,checkAdminMiddleware,addSubArea)
router.post('/select-area',selectArea)
router.get('/get-area',getWorkArea)
router.get('/get-subarea',getSubArea)
router.post('/calculate',calculate)
router.post('/edit-station-name',authenticateMiddleware,checkAdminMiddleware,editStationName)
router.post('/status',changeStatus)
router.post('/hidearea',authenticateMiddleware,checkAdminMiddleware,changeStatusArea)
router.post('/deletesubarea',authenticateMiddleware,checkAdminMiddleware,deleteSubArea)
router.post('/deletearea',authenticateMiddleware,checkAdminMiddleware,deleteArea)
module.exports= router