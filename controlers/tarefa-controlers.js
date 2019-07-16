const MongoClient = require('mongodb').MongoClient; //biblioteca para conectar ao mongodb

/**
 * Busca a tarefa na lista de tarefas da republica, ao encontrar registra o cumprimento dela pelo usuario
 * @param {*} login 
 * @param {*} nomeRepublica 
 * @param {*} nomeTarefa 
 */
async function registrarTarefa(login, nomeRepublica, nomeTarefa){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            //Verificando se há relação entre login, republica e tarefa
            db.collection('republicas').findOne({
                nome: nomeRepublica,
                participantesID: login,
                modelosTarefas: { $elemMatch: { nome: nomeTarefa} }
            }, function(err, query){
                if(err) reject(err)

                var tarefa = query.modelosTarefas.find(tarefa=> tarefa.nome == nomeTarefa)

                //aplicando tarefa
                db.collection('tarefas').insertOne({
                    nome: tarefa.nome,
                    valor: tarefa.valor,
                    login: login,
                    republica: nomeRepublica,
                    data: Date.now()
                })

                db.collection('usuarios').updateOne({
                    login: login
                },{
                    $inc: { saldo: tarefa.valor}
                })

                resolve("OK")
            })
        })
    })
}

async function lista(login, nomeRepublica){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('tarefas').find({
                login: login,
                republica: nomeRepublica
            }).toArray(function(err, docs){
                if(err) reject(err)
                resolve(docs)
            })
        })
    })
}

async function totalTarefasRep(nomeRepublica, quantUltimas){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('tarefas').find({
                republica: nomeRepublica
            }).toArray(function(err, docs){
                if(err) reject(err)
                resolve({
                    total: docs.length,
                    ultimas: docs.slice(-quantUltimas)
                })
            })
        })
    })
}


module.exports = {
    registrarTarefa:registrarTarefa,
    lista: lista,
    totalTarefasRep: totalTarefasRep
}