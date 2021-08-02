var express = require('express');
var router = express.Router();
const Mongolib = require("../db/Mongolib");

/* POST */
router.post('/', function (req, res, next) {

  const correo = req.body.contenido.correo;

  const password = req.body.contenido.contrasena.toString();
  Mongolib.getDatabase(db => {
    Mongolib.logIn(db, correo, docs => {
      if (docs[0] !== undefined) {

        if (password === docs[0].contrasena) {
          
          res.send({valor:true,
          id:docs[0].id});
        }
        else {
          res.send({valor:false});
        }
      }
      else {
        res.send({valor:false});
      }
    })
  })
});

module.exports = router;