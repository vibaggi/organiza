const router = require('express').Router();
const controller = require('../controlers/pontos-controllers')

router.get("/saldo/:username", function(req, res){
    //extraindo parametros
    var username = req.params.username
    controller.saldo(username).then(resp=>{
        console.log(resp);
        return res.status(200).send({saldo: resp} )
    }).catch(error =>{
        return res.status(500).send(error)
    })
})


router.post("/transferir", function(req, res){
    //extraindo parametros
    var remetente       = req.body.remetente
    var destinatario    = req.body.destinatario
    var republica       = req.body.republica
    var valor           = req.body.valor

    //verificando parametros
    if(!remetente || !destinatario || !republica || !valor) return res.status(500).send("faltam parametros")
    
    controller.enviarPontos(remetente, destinatario, republica, valor).then(resp=>{
        return res.status(200).send(resp)
    }).catch(error=>{
        return res.status(500).send(error)
    })
})

router.get("/lista", function(req, res){
    //extraindo parametros
    var login       = req.query.login
    var republica   = req.query.republica

    //verificando parametros
    if(!login || !republica) return res.status(500).send("faltam parametros")
    
    controller.extratoTransferencias(login, republica).then(resp=>{
        return res.status(200).send(resp)
    }).catch(error =>{
        return res.status(500).send(error)
    })
})

router.get("/extrato", function(req, res){
    //extraindo parametros
    var login       = req.query.login
    var republica   = req.query.republica

    //verificando parametros
    if(!login || !republica) return res.status(500).send("faltam parametros")
    
    controller.extratoTotal(login, republica).then(resp=>{
        return res.status(200).send(resp)
    }).catch(error =>{
        return res.status(500).send(error)
    })
})





module.exports = router