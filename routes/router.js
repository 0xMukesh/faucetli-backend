const router = require('express').Router();

const token = require('../controllers/token');

router.get('/token', token);

module.exports = router