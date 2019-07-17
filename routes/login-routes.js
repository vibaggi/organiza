const router = require('express').Router();
const auth = require('../services/auth-service')

// //Função para novo cadastro
router.post("/register", function (req, res) {
    auth.signUp(req.body.username, req.body.password, req.body.email).then(resp => {
        console.log(` ==== INFO ==== Register :: ${req.body.username} :: ${req.body.password} :: ${req.body.email} `)

        res.send(resp)
    }).catch(error => {
        res.status(401).send(error)
    })
})

// //funcao de login e retorno de token
router.post("/login", function (req, res) {
    auth.login(req.body.username, req.body.password).then(credenciais => {
        console.log(` ==== INFO ==== Login :: ${req.body.username} :: ${req.body.password}`)

        auth.validateToken(credenciais.token).then(resp => {
            res.send({ token: credenciais.token, data: resp, apelido: credenciais.apelido })
        })
    }).catch(error => {
        res.status(401).send(error)
    })
})

// //verificador de token para funcoes a baixo
router.use(function (req, res, next) {
    if (req.headers.token == undefined) res.status(401).send("TOKEN NÃO INFORMADO")
    auth.validateToken(req.headers.token).then(resp => {

        req.authObject = {
            username: resp.username,
            org: resp.organization,
            walletName: resp.organization
        }
        next()
    }).catch(error => {
        res.status(401).send(error)
    })
})

module.exports = router