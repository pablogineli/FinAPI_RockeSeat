const express = require("express");
const {v4: uuidV4} = require('uuid')

const app = express();
app.use(express.json())

const custumers = [];

/**
 * CPF - strinf
 * name - string
 * id - UUiD
 * statement []
 */
app.post('/account', (request, response)=>{
    const { cpf, name } = request.body;
    const id = uuidV4();

    custumers.push({
        cpf,
        name,
        id,
        statement: []
    })

    return response.status(201).send();
})

app.listen(3333)