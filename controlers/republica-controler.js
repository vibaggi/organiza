const MongoClient = require('mongodb').MongoClient; //biblioteca para conectar ao mongodb


async function criarRepublica(nome, participantesID, regrasLista){
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) console.log(err);
            var db = client.db(process.env.MONGO_DATABASE);

            //criando republica
            var republica = {
                nome: nome,
                participantesID: participantesID,
                regrasLista: regrasLista,
                modelosTarefas: [] //Modelos de tarefas comecao vazios
            }

            db.collection("republicas").insertOne(republica, function(err, res){
                if(err) reject(err)
                resolve({message: "sucesso"})
            })
        })
    })
}

async function atualizarRegrasRepublica(nome, regrasLista){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err){
                reject(err)
            }
            
            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('republicas').updateOne(
                { //Query
                    nome: nome
                },
                { //Update
                    $set: {regrasLista: regrasLista}
                },
                function(err, client){
                    if(err) reject(err)
                    resolve(client)
                }
            )
        })
    })
}

/**
 * Busca uma lista de republica
 * @param {*} nome opcional
 */
async function getListaRepublica(nome){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('republicas').find({
                nome: { $regex: `.*${nome}.*`, $options: 'i'}
            }).toArray(function(err, docs){
                if(err) reject(err)
                console.log(docs);
                resolve(docs)
            })
        })
    })
}

async function adicionaMembro(login, nomeRepublica){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)
            
            db.collection('republicas').update(
                {nome: {$eq: nomeRepublica}},
                { $push: { participantesID: login }}
            ).then(resp=>{
                resolve(resp)
            }).catch(error=>{
                reject(error)
            })

            
        })
    })
}

async function atualizarModelosTarefas(modelos, nomeRepublica){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('republicas').update(
                { //Query
                    nome: nomeRepublica
                },
                { //Update
                    $set: {modelosTarefas: modelos}
                },
                function(err, client){
                    if(err) reject(err)
                    resolve(client)
                }
            )
           
            
        })
    })
}

/**
 * Retorna informacoes de uma republica. Tarefas e Regras
 * @param {*} parametros 
 */
async function infoRepublica(nome){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)
            db.collection('republicas').findOne({
                nome: nome
            }).then(resp=>{
                resolve(resp)
            }).catch(error=>{
                reject(error)
            })
        })
    })
}

async function infoRepublicaPorUsuario(nomeUsuario){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)
            db.collection('republicas').findOne({
                participantesID: nomeUsuario
            }).then(resp=>{
                resolve(resp)
            }).catch(error=>{
                reject(error)
            })
        })
    })
}

async function listaModelosTarefas(nomeRepublica){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('republicas').findOne({
                nome: nomeRepublica
            }, function(err, result){
                if(err) reject(err)

                resolve(result.modelosTarefas)
            })
        })
    })
}



module.exports = {
    criarRepublica: criarRepublica,
    atualizarRegrasRepublica: atualizarRegrasRepublica,
    getListaRepublica: getListaRepublica,
    adicionaMembro: adicionaMembro,
    atualizarModelosTarefas: atualizarModelosTarefas,
    infoRepublica: infoRepublica,
    listaModelosTarefas: listaModelosTarefas,
    infoRepublicaPorUsuario: infoRepublicaPorUsuario
}