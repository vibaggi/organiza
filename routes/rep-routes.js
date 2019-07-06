const router = require('express').Router();
const controller = require('../controlers/republica-controler')
const auth = require('../services/auth-service')
const mongo = require('../services/mongo')

// //Função para novo cadastro
// router.post("/register", function (req, res) {
//     auth.signUp(req.body.username, req.body.password, req.body.email).then(resp => {
//         console.log(` ==== INFO ==== Register :: ${req.body.username} :: ${req.body.password} :: ${req.body.email} `)

//         res.send(resp)
//     }).catch(error => {
//         res.status(401).send(error)
//     })
// })

// //funcao de login e retorno de token
// router.post("/login", function (req, res) {
//     auth.login(req.body.username, req.body.password).then(token => {
//         console.log(` ==== INFO ==== Login :: ${req.body.username} :: ${req.body.password}`)

//         auth.validateToken(token).then(resp => {
//             res.send({ token: token, data: resp })
//         })
//     }).catch(error => {
//         res.status(401).send(error)
//     })
// })

// //verificador de token para funcoes a baixo
// router.use(function (req, res, next) {
//     if (req.headers.token == undefined) res.status(401).send("TOKEN NÃO INFORMADO")
//     auth.validateToken(req.headers.token).then(resp => {

//         req.authObject = {
//             username: resp.username,
//             org: resp.organization,
//             walletName: resp.organization
//         }
//         next()
//     }).catch(error => {
//         res.status(401).send(error)
//     })
// })

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

router.get("/getListaModelos/:nome", function(req, res){
    controller.listaModelosTarefas(req.params.nome).then(resp=>{
        res.status(200).send(resp)
    }).catch(error=>{
        res.status(500).send(error)
    })
})

module.exports = router