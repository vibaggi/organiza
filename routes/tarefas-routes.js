const router = require('express').Router();
const controller = require('../controlers/tarefa-controlers')


router.put("/registrar", function(req, res){
    
    //Extraindo parametros do body
    var login           = req.body.login
    var nomeRepublica   = req.body.nomeRepublica
    var nomeTarefa       = req.body.nomeTarefa
    
    //Falta de parametros retorna erro
    if(!login || !nomeRepublica || !nomeTarefa){
        res.status(500).send('faltam parametros')
        return
    }

    //Chamando função de registrar Tarefa
    controller.registrarTarefa(login, nomeRepublica, nomeTarefa).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/lista", function(req, res){
    controller.lista(req.query.login, req.query.nomeRepublica).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

module.exports = router
