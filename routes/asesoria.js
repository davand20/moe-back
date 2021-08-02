var express = require('express');
var router = express.Router();
const Mongolib = require("../db/Mongolib");

/* GET home page. */
router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.findAsesoriasMonitor(db, id, docs => {
            res.send(docs);
        })
    })
});

module.exports = router;