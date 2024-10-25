const express = require('express');
const app = express();
const handlebars = require('express-handlebars').engine;
const bodyParser = require('body-parser');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require(''); //retirado

// Importando o Handlebars para poder registrar os helpers
const Handlebars = require('handlebars');

// Inicializando o Firebase
initializeApp({
    credential: applicationDefault()
});

const db = getFirestore()

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Registrando o helper 'eq'
Handlebars.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
});

app.get('/', function(req, res) {
    res.render('primeira_pagina (1).handlebars');
});

app.post('/cadastrar', function(req, res) {
    db.collection('clientes').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacoes: req.body.observacoes
    }).then(function() {
        console.log('Dados cadastrados com sucesso!');
        res.redirect('/');
    }).catch(function(error) {
        console.error('Erro ao cadastrar os dados:', error);
    });
});

app.get("/consultar", function(req, res) {
    var posts = [];
    db.collection('clientes').get().then(function(snapshot) {
        snapshot.forEach(function(doc) {
            const data = doc.data();
            data.id = doc.id;
            //console.log(doc.data())
            posts.push(data);
        });
        res.render("consultar", {posts: posts});
    });
});

app.listen(8081, function() {
    console.log('Servidor Ativo!');
});

app.post("/atualizar", function(req, res){
    const id = req.body.id
    var result = db.collection('clientes').doc(id).update({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao
    }).then(function(){
      console.log('Documento atualizado com sucesso!');
      res.redirect('/consultar')
    })
  })

  app.get("/excluir/:id", function(req, res) {
    const id = req.params.id;
    var result = db.collection('clientes').doc(id).delete().then(function(){
        console.log('Documento excluido com sucesso!');
    });
    res.redirect('/consultar');
});