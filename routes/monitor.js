var express = require('express');
var router = express.Router();
const Mongolib = require("../db/Mongolib");

/* GET home page. */
router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.findMonitor(db, id, docs => {
            res.send(docs);
        })
    })
});

router.get('/:id/curso', function (req, res, next) {
    const id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.findMonitor(db, id, docs => {
            Mongolib.findCurso(db,docs[0].id_curso,docs1 =>{
                res.send(docs1[0]);
            })

        })
    })
});

router.get('/:id/usuario', function (req, res, next) {
    const id = req.params.id;
    Mongolib.getDatabase(db => {
        Mongolib.findMonitor(db, id, docs => {
            Mongolib.findIdUsuario(db,docs[0].id_usuario,docs1 =>{
                res.send(docs1[0]);
            })

        })
    })
});

module.exports = router;