var express = require('express');
var router = express.Router();
const Mongolib = require("../db/Mongolib");


router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id, 10);
  Mongolib.getDatabase(db => {
    Mongolib.findIdUsuario(db, id, docs => {
      res.send(docs[0])
    })
  })
});

router.get('/:id/monitorias', function (req, res, next) {
  var id = parseInt(req.params.id, 10);
  Mongolib.getDatabase(db => {
    Mongolib.findUsuarioMonitorias(db, id, docs => {
      res.send(docs)
    })
  })
});

router.get('/:id/calificaciones', function (req, res, next) {
  var id = parseInt(req.params.id, 10);
  Mongolib.getDatabase(db => {
    Mongolib.findUsuarioCalificaciones(db, id, docs => {
      res.send(docs)
    })
  })
});

router.post('/registrarAsesoria', function (req, res, next) {
  const correo = req.body.contenido.correo;
  const monitorId = req.body.contenido.monitorId;
  const curso = req.body.contenido.curso;
  const nombre = req.body.contenido.nombre;
  Mongolib.getDatabase(db => {
    Mongolib.logIn(db, correo, docs => {
      if (docs[0] !== undefined) {
        Mongolib.registrarAsesoria(db, docs[0].id, monitorId, curso, nombre, docs1 => {
          res.send({ valor: true });
        })
      }
      else {
        res.send({ valor: false });
      }
    })
  })
});

router.post('/registrarCalificacion', function (req, res, next) {
  const nota = req.body.contenido.nota; 
  const comentario = req.body.contenido.comentario.toString(); 
  const asesoriaId = req.body.contenido.asesoriaId; 
  Mongolib.getDatabase(db => {
    Mongolib.registrarCalificacion(db, asesoriaId, nota,comentario, docs => {
      res.send({valor:true})
      Mongolib.findAsesoria(db, asesoriaId, docs =>{
        Mongolib.findMonitor(db, docs[0].id_monitor, docs1 =>{
          Mongolib.actualizarNotaMonitor(db, docs1,nota)
        })
      });
    })
  })
});

router.post('/suspenderMonitoria', function (req, res, next) {
  const id = req.body.contenido.monitorId
  Mongolib.getDatabase(db => {
    Mongolib.suspenderMonitoria(db, id, docs => {
      res.send({valor:true})
    })
  })
});

router.post('/agregarMonitoria', function (req, res, next) {
  const cursoId = req.body.contenido.cursoId;
  const userId = req.body.contenido.userId;
  const curso = req.body.contenido.curso;
  const nombre = req.body.contenido.nombre;
  console.log(req.body.contenido)
  Mongolib.getDatabase(db => {
    Mongolib.findMonitorByCursoAndUsuario(db, cursoId, userId, docs => {
      if(docs[0] === undefined)
      {
        Mongolib.addMonitorNuevo(db, cursoId, userId, curso, nombre, docs1 =>{
          res.send({valor:true})
        })
      }
      else
      {
        if(docs[0].activo === false)
        {
          Mongolib.activarMonitoria(db, docs[0].id, docs2 =>{
            res.send({valor:true})
          })
        }
        else
        {
          res.send({valor:false})
        }
      }
    })
  })
});
module.exports = router;
