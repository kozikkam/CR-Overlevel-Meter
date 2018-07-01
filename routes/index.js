const playersController = require('../controllers/index').players;
const arenasController = require('../controllers/index').arenas;

module.exports = (app) => {
    app.get('/', (req, res) => {res.status(200).render('index')});
    app.get('/view-player', (req, res) => {
        playersController.getOne(req, res)
            .then((data) => res.render('players', data))
            .catch((err) => {console.log(err); res.render('error', err)});
    });
    app.get('/create-arenas', (req, res) => arenasController.createArenas(req, res));
    app.get('/update', async (req, res) => {
        playersController.update(req, res)
        .then((data) => res.send(data))
        .catch((err) => {console.log(err); res.render('error', err)});
    });
    app.get('/view-arenas', async (req, res) => res.render('arenas', await arenasController.viewArenas(req, res)));
}
