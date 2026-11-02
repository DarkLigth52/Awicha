// Punto de entrada: npm start
const express = require('express'), path = require('path'), cfg = require('./config'), auth = require('./auth'), mw = require('./middleware');
const app = express();
app.disable('x-powered-by');
app.use(mw.headers, express.json({ limit: '10mb' }), express.static(path.join(__dirname, '..', 'public')));
app.use('/api/login', mw.loginLimit);
app.use('/api', auth.login, auth.guard, require('./routes/users'), require('./routes/operations'), require('./routes/crud'));
app.use(mw.errorHandler);
app.listen(cfg.port, () => console.log('Libro de cuentas en http://localhost:' + cfg.port));
