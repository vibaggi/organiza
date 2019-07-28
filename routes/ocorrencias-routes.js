const router = require('express').Router();
const controller = require('../controlers/ocorrencias-controllers')

router.put("/registrar", function(req, res){
    //Extraindo dados do body
    var acusador    = req.body.acusador
    var reu     = req.body.reu
    var lei         = req.body.lei
    var republica   = req.body.republica

    //verificando se dados foram enviados
    if(!acusador || !reu || !lei || !republica){
        res.status(500).send("Faltam argumentos no body!")
        return
    }

    controller.registrarOcorrencia(acusador,republica,reu, lei).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

/**
 * Retorna a lista de ocorrencias de um usuario em uma republica
 */
router.get("/lista", function(req, res){
    //Extraindo dados da query
    var login       = req.query.login
    var republica   = req.query.republica
    //verificando parametros
    if(!login || !republica){
        res.status(500).send("faltam parametros")
        return
    }

    //chamando funcao
    controller.listarOcorrencias(login, republica).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/:republica/:quantUltimas", function(req, res){
    controller.totalTarefasRep(req.params.republica, req.params.quantUltimas).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})


module.exports = router

