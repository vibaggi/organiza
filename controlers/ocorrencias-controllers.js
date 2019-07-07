const MongoClient = require('mongodb').MongoClient; //biblioteca para conectar ao mongodb

/**
 * Uma ocorrencia é registrada pelo acusador contra o acusado.
 * O acusado é multado de acordo com a lei inflingida.
 * É necessário passar o nome da república para validação.
 * @param {*} acusador 
 * @param {*} republica 
 * @param {*} acusado 
 * @param {*} lei 
 */
async function registrarOcorrencia(acusador, republica, reu, lei){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('republicas').findOne({
                nome: republica,
                participantesID: { $all: [acusador, reu ] },
                'regrasLista.nome': lei
            }, function(err, republica){
                if(err){
                    reject(err)
                    return
                }  
                
                //extraindo dados da lei inflingida
                console.log(republica == null);
                if(republica == null){ 
                    reject("CONTEXTO NÃO ENCONTRADO")
                    return
                }

                var regra = republica.regrasLista.find(regra=> regra.nome == lei)
                var data = Date.now()
                db.collection('ocorrencias').insertOne({
                    acusador,
                    reu,
                    republica: republica.nome,
                    regra,
                    data
                })

                db.collection('usuarios').updateOne({
                    login: reu
                },{
                    $inc: {saldo: -regra.pontos}
                })

                resolve("OK")

            })


        })
    })
}

async function listarOcorrencias(reu, republica){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(process.env.MONGO_URL, function(err, client){
            if(err) reject(err)

            var db = client.db(process.env.MONGO_DATABASE)

            db.collection('ocorrencias').find({
                reu,
                republica
            }).toArray(function(err, docs){
                if(err) {
                    reject(err)
                    return
                }

                resolve(docs)
            })
        })
    })
}

module.exports = {
    registrarOcorrencia: registrarOcorrencia,
    listarOcorrencias: listarOcorrencias
}