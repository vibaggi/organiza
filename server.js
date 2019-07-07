require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.options('*', cors());
app.use(logger('[:date[clf]] | ":method :url HTTP/:http-version" | STATUS: :status | CONTENT_LENGTH: :res[content-length] | RESPONSE_TIME: :response-time ms'));

app.use("/republicas", require('./routes/rep-routes'))
app.use("/tarefas", require("./routes/tarefas-routes"))
app.use("/ocorrencias", require("./routes/ocorrencias-routes"))
app.use("/pontos", require("./routes/pontos-routes"))

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
    console.log(`Servidor rodando em http://localhost:${app.get('port')}`)
})
