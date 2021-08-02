
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'moe';

const client = new MongoClient(url, { useUnifiedTopology: true });

const getDatabase = (callback) => {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        callback(db, client);
    });
}

const findCursos = function (db, callback) {
    const collection = db.collection('cursos');
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findMonitoresCurso = function (db, id, callback) {
    const collection = db.collection('monitor');
    var curso = parseInt(id, 10);
    collection.find({ id_curso: curso, activo:true }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findCurso = function (db, id, callback) {
    const collection = db.collection('cursos');
    var curso = parseInt(id, 10);
    collection.find({ id: curso }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findMonitor = function (db, id, callback) {
    const collection = db.collection('monitor');
    var monitor = parseInt(id, 10);
    collection.find({ id: monitor }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findAsesoriasMonitor = function (db, id, callback) {
    const collection = db.collection('asesoria');
    var monitor = parseInt(id, 10);
    collection.find({ id_monitor: monitor, comentario: { $ne: "" }}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findIdUsuario = function (db, id_usuario, callback) {
    const collection = db.collection('usuario');
    collection.find({ id: id_usuario }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const logIn = function (db, mail, callback) {
    const collection = db.collection('usuario');
    collection.find({ correo: mail }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}
const findUsuarioCalificaciones = function (db, id, callback) {
    const collection = db.collection('asesoria');
    var userId = parseInt(id, 10);
    collection.find({ id_cliente: userId, nota: { $eq: null } }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findUsuarioMonitorias = function (db, id, callback) {
    const collection = db.collection('monitor');
    var userId = parseInt(id, 10);
    collection.find({ id_usuario: userId, activo: true }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const registrarAsesoria = function (db, userId, monitorId, nombreC, nombreM, callback) {
    const collection = db.collection('asesoria');
    var intId = parseInt(userId, 10);
    collection.count().then(res => {
        const info = {
            id: res + 1,
            id_cliente: intId,
            id_monitor: monitorId,
            nota: null,
            fecha: null,
            comentario: "",
            curso: nombreC,
            nombre: nombreM
        }
        collection.insert(info, function (err, docs) {
            assert.equal(err, null);
            callback(docs);
        });
    })
}

const registrarCalificacion = function (db, id, nota, comment, callback) {
    const collection = db.collection('asesoria');
    var intId = parseInt(id, 10);
    var doubleNota = parseFloat(nota);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    collection.update({ id: intId }, { $set: { nota: doubleNota, fecha: today, comentario: comment } }, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const suspenderMonitoria = function (db, id, callback) {
    const collection = db.collection('monitor');
    var intId = parseInt(id, 10);
    collection.update({ id: intId }, { $set: { activo: false } }, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const findAsesoria = function (db, id, callback) {
    const collection = db.collection('asesoria');
    var asesoriaId = parseInt(id, 10);
    collection.find({ id: asesoriaId }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}


const actualizarNotaMonitor = function (db, res, number) {
    var nota = parseFloat(number);
    const nuevaNota = res[0].calificacion * res[0].n_calificacion + nota;
    const promedio = Math.round((nuevaNota / (res[0].n_calificacion + 1)) * 100) / 100
    db.collection('monitor').update({ id: res[0].id }, { $set: { calificacion: promedio, n_calificacion: res[0].n_calificacion + 1 } })
}

const findMonitorByCursoAndUsuario = function (db, curso, user, callback) {
    const collection = db.collection('monitor');
    var cursoId = parseInt(curso, 10);
    var userId = parseInt(user, 10);
    collection.find({ id_curso: cursoId, id_usuario:userId}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const addMonitorNuevo = function (db, curso, user, cursoN , userN, callback) {
    const collection = db.collection('monitor');
    var cursoId = parseInt(curso, 10);
    var userId = parseInt(user, 10);
    collection.count().then(res => {
        const info = {
            id: res + 1,
            id_curso: cursoId,
            id_usuario: userId,
            calificacion: 0.0,
            n_calificacion: 0,
            nombre: userN,
            curso: cursoN,
            activo: true
        }
        collection.insert(info, function (err, docs) {
            assert.equal(err, null);
            callback(docs);
        });
    })
}

const activarMonitoria = function (db, id, callback) {
    const collection = db.collection('monitor');
    var intId = parseInt(id, 10);
    collection.update({ id: intId }, { $set: { activo: true } }, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

exports.getDatabase = getDatabase;
exports.findCursos = findCursos;
exports.findMonitoresCurso = findMonitoresCurso;
exports.findCurso = findCurso;
exports.findMonitor = findMonitor;
exports.findAsesoriasMonitor = findAsesoriasMonitor;
exports.findIdUsuario = findIdUsuario;
exports.logIn = logIn;
exports.findUsuarioCalificaciones = findUsuarioCalificaciones
exports.findUsuarioMonitorias = findUsuarioMonitorias;
exports.registrarAsesoria = registrarAsesoria;
exports.registrarCalificacion = registrarCalificacion;
exports.suspenderMonitoria = suspenderMonitoria;
exports.actualizarNotaMonitor = actualizarNotaMonitor;
exports.findAsesoria = findAsesoria;
exports.findMonitorByCursoAndUsuario = findMonitorByCursoAndUsuario;
exports.addMonitorNuevo = addMonitorNuevo;
exports.activarMonitoria = activarMonitoria;