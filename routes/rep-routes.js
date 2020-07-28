const router = require('express').Router();
const controller = require('../controlers/republica-controler')


router.post("/criar", function(req, res){
    if(!req.body.nome || !req.body.participantesID || !req.body.regrasLista ) {
        res.status(500).send("há campos faltando!")
        return
    }
    controller.criarRepublica(req.body.nome, req.body.participantesID, req.body.regrasLista).then(resp=>{
        res.status(200).send(resp)    
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post("/atualizarRegras", function(req, res){
    if(!req.body.regrasLista || !req.body.nomeRepublica){
        res.status(500).send("Campo regrasLista não encontrado")
    }
    controller.atualizarRegrasRepublica(req.body.nomeRepublica, req.body.regrasLista).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post("/atualizarModelosTarefas", function(req, res){
    if(!req.body.modelos || !req.body.nomeRepublica){
        res.status(500).send("Campo regrasLista não encontrado")
    }
    controller.atualizarModelosTarefas(req.body.modelos, req.body.nomeRepublica).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/getLista", function(req, res){
    controller.getListaRepublica(req.query.nome).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post("/adicionaMembro", function(req, res){
    controller.adicionaMembro(req.body.login, req.body.nomeRepublica).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/info/:nome", function(req, res){
    controller.infoRepublica(req.params.nome).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/info/poruser/:nome", function(req, res){
    controller.infoRepublicaPorUsuario(req.params.nome).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/getListaModelos/:nome", function(req, res){
    controller.listaModelosTarefas(req.params.nome).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/rank/:nome", function(req, res){
    controller.rankRepublica(req.params.nome).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get("/usuario-sem-republica", function(req, res){
    controller.usuariosSemRepublica().then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})



module.exports = router