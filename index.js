const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'db2'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

//Rotas REST

server.get('/', restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'
}));

server.get('/read', function (req, res, next) {
    //Consulta a tabela do db que retorna os dados no formato definidi, nesse caso, json.
    knex('rest').then((dados)=>{
        res.send(dados);
    },next);
        
    return next();
  });

  server.post('/create', function(req, res, next){
      knex('rest')
        .insert(req.body)
        .then((dados)=>{
            res.send(dados);
        }, next);
  });
//Caractere especial : serve para que o servidor espere por um parâmetro coringa para ser reaproveitado na sua consulta.
  server.get('/show/:id', function (req, res, next) {
    const {id} = req.params;

    knex('rest')
        .where('id', id)
        .first()
        .then((dados)=>{
            if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado'));
            res.send(dados);
    },next);
});

server.put('/update/:id', function (req, res, next) {
  const {id} = req.params;

  knex('rest')
      .where('id', id)
      .update(req.body)
      .then((dados)=>{
          if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado'));
          res.send('dados atualizados');
  },next);
});

server.del('/delete/:id', function (req, res, next) {
  const {id} = req.params;

  knex('rest')
      .where('id', id)
      .delete()
      .then((dados)=>{
          if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado'));
          res.send('dados excluídos');
  },next);
});