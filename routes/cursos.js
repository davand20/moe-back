var express = require('express');
var router = express.Router();
const Mongolib = require("../db/Mongolib");

/* GET home page. */
router.get('/', function (req, res, next) {
    Mongolib.getDatabase(db => {
        Mongolib.findCursos(db, docs => {
            res.send(docs);
        })
    })
});

router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.findCurso(db, id, docs => {
            res.send(docs);
        })
    })
});

router.get('/monitor/:id', function (req, res, next) {
    const id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.findMonitoresCurso(db, id, docs => {
            res.send(docs);
        })
    })
});
module.exports = router;