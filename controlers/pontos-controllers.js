const MongoClient = require('mongodb').MongoClient; //biblioteca para conectar ao mongodb

async function saldo(login){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function (err, client) {
            if (err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)
            
            db.collection('usuarios').findOne({
                login
            }, function(err, result){
                if (err) {
                    reject(err)
                    client.close()
                    return
                }
                console.log(result);
                if(!result) reject("Usuario invalido")
                resolve(result.saldo)
                client.close()
            })
        })
    })
}
async function enviarPontos(remetente, destinatario, republica, valor) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_URL, function (err, client) {
            if (err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            //verificando contexto
            //Só se pode trocar pontos na mesma republica
            db.collection('republicas').findOne({
                nome: republica,
                participantesID: { $all: [remetente, destinatario] }
            }, function (err, result) {
                if (err) {
                    reject(err)
                    client.close()
                    return
                }

                //registrando troca de pontos
                db.collection('pontos').insertOne({
                    remetente,
                    destinatario,
                    republica,
                    valor,
                    data: Date.now()
                })

                //retirando saldo do remetente
                db.collection('usuarios').updateOne({
                    login: remetente
                }, {
                        $inc: { saldo: -valor }
                    })

                //adicionando saldo no destinatário
                db.collection('usuarios').updateOne({
                    login: destinatario
                }, {
                        $inc: { saldo: valor }
                    })

                resolve("TRANSFERENCIA REALIZADA")
                client.close()
            })


        })
    })
}

async function extratoTransferencias(login, republica) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_URL, function (err, client) {
            if (err) {
                reject(err)
                client.close()
                return
            }

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('pontos').find({
                republica: republica,
                $or: [
                    { remetente: login },
                    { destinatario: login }
                ]
            }).toArray(function (err, docs) {
                if (err) {
                    reject(err)
                    client.close()
                    return
                }

                resolve(docs)
                client.close()

            })

        })
    })
}

/**
 * Retorna toda a movimentacao de pontos (tarefas, ocorrencias e transferencias)
 * @param {*} login 
 * @param {*} republica 
 */
async function extratoTotal(login, republica){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)
            var tarefas = [];
            var ocorrencias;
            var transferencias;

            db.collection('tarefas').find({
                login,
                republica
            }).toArray(function(err, docs){
                tarefas = docs
                db.collection('ocorrencias').find({
                    reu: login, republica
                }).toArray(function(err, docs){
                    ocorrencias = docs
                    db.collection('pontos').find({
                        $or: [
                            { remetente: login },
                            { destinatario: login }
                        ],
                        republica
                    }).toArray(function(err, docs){
                        transferencias = docs

                        resolve({
                            tarefas,
                            ocorrencias,
                            transferencias
                        })
                        client.close()
                    })
                })
            })

            
        })
    })
}

module.exports = {
    saldo: saldo,
    enviarPontos: enviarPontos,
    extratoTransferencias: extratoTransferencias,
    extratoTotal: extratoTotal
}