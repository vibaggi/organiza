const MongoClient = require('mongodb').MongoClient; //biblioteca para conectar ao mongodb
const criptoHash = require('password-hash'); //biblioteca para encriptar a senha
var randtoken = require('rand-token'); //gera um token aleatório
var tokensMap = new Map() //tokens armazenados em memoria

/**
 * Registra um usuário e senha em um serviço de banco de dados. A Senha será criptografa com um HASH.
 * @param {*} username 
 * @param {*} password this will be encripto
 * @param {*} organization 
 */
function signUp(username, password, email) {
    return new Promise((resolve, reject) => {
        //Iniciando conexao com o mongo
        MongoClient.connect(process.env.MONGO_URL, function (err, client) {
            if(err) console.log(err);
            var db = client.db(process.env.MONGO_DATABASE);

            //criando usuario
            var user = {
                login: username,
                password: criptoHash.generate(password),
                email: email
            }
            //TODO: verificar se já existe o usuario da org
            db.collection("usuarios").insertOne(user, function (err, res) {
                //caso dispare erro na criacao da conta
                if (err) reject(err)
                resolve({message: "success"})
            })

            client.close();
        });


    })
}



/**
 * Verifica login/senha e gera um token de acesso. O Token irá experar toda vez que entrar.
 * @param {*} username 
 * @param {*} password senha pura, será verificada com a encriptografada
 * @param {*} organization 
 */
function login(username, password) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            //Conectando ao banco
            var db = client.db(process.env.MONGO_DATABASE);
            //selecionando a collection
            const userCollection = db.collection("usuarios")
            
            //encontrando usuario da organização
            userCollection.findOne({"login": username}).then(resp=>{
                //verificando se a senha informada é valida!
                if(criptoHash.verify(password, resp.password)){
                    //Generate token
                    var token = randtoken.generate(16)
                    //salvando valores num Map
                    tokensMap.set(token, {
                        username: username, 
                        generateDate: Date.now() 
                    })
                    resolve(token)
                }else{
                    reject("login/senha invalida")
                }
            }).catch(error=>{
                console.log(error);
                reject(error)
            })
        })
    })
}


/**
 * Valida o token e retorna usuario e organizacao
 * @param {*} token 
 */
function validateToken(token){
    return new Promise((resolve, reject)=>{
        var result = tokensMap.get(token)
        if(result == undefined) reject("Token invalido!")
        //verificando validade do token
        if(Date.now() - result.generateDate > 1000*60*60){
            tokensMap.delete(token) //deletando token do map
            reject("token expirado")
        }
        resolve(result) 
    })
}


module.exports = {
    signUp: signUp,
    login:  login,
    validateToken: validateToken
}