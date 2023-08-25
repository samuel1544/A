const http = require('http');
const app = require('./app');
const server = http.createServer(app);

//POUR NORMALISER LE PORT D'UTILISATION DE L'API

const normalizeport = val =>{
    const port = parseInt(val,10);
    if (isNaN){
        return val;
    }
    if (port>=0){
        return  val;
    }
    return false;
};
const port = normalizeport(process.env.PORT ||'4100');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

server.on('error', errorHandler);
server.on('listening', ()=>{
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    console.log('Listening on' + bind); 
});
server.listen(port);