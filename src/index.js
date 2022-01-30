import express from "express";
import {v4 as uuidV4} from "uuid"

const app = express();
app.use(express.json())

const custumers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next){
    const {cpf} = request.headers;
    const custumer =  custumers.find((custumer)=> custumer.cpf === cpf);

    if (!custumer){
        return response.status(400).json({error: "Customer not found"});
    }
    //Repassa as informações do Headers para as rotas
    request.customer = custumer;

    // Continua a aplicação
    return next();
}

function getBalance(statement){
    const balance = statement.reduce((acc, operation)=>{
        if (operation.type === "credit"){
            return acc + operation.amount;
        }else {
            return acc - operation.amount;
        }
    }, 0)

    return balance;
}

/**
 * CPF - string
 * name - string
 * id - UUiD
 * statement []
 */
app.post('/account', (request, response)=>{
    const { cpf, name } = request.body;

    const customersAlreadyExists = custumers.some((custumers)=> custumers.cpf === cpf)

    if (customersAlreadyExists){
        return response.status(400).json({error: "Customer already exists!"});
    }

    custumers.push({
        cpf,
        name,
        id: uuidV4(),
        statement: []
    })

    return response.status(201).send();
})

/**
 * Usando a MiddleWare de altenticação dessa forma todas as rotas a baixa do codigo vão passar por ela!
 *
 *          app.use(verifyIfExistsAccountCPF)
 */

app.get("/statement", verifyIfExistsAccountCPF, (request, response)=>{
    const {customer} = request;

    return response.json(customer.statement)
})

app.post("/deposit", verifyIfExistsAccountCPF, (request, response)=>{
    const { description, amount} = request.body;
    const {customer } = request

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send();


});

app.post('/withdraw', verifyIfExistsAccountCPF, (request, response)=>{
    const {amount}= request.body;
    const {customer} = request

    const balance = getBalance(customer.statement)

    if (balance < amount){
        return response.status(400).json({error : "insufficient founds!"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send()
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response)=>{
    const {customer} = request;
    const { date} = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    return response.json(statement)
});

app.put("/account", verifyIfExistsAccountCPF,(request, response)=>{
    const { name } = request.body
    const { customer } = request

    customer.name = name


    response.status(201).send();
});

app.get("/account", verifyIfExistsAccountCPF, (request, response)=>{
        const {customer} = request;

        return response.json(customer)
});

app.delete("/account", verifyIfExistsAccountCPF, (request, response)=>{
    const {customer} = request;

    custumers.splice(customer, 1);

    return response.status(200).json(custumers);
});

app.get("/balance", verifyIfExistsAccountCPF, (request, response)=>{
    const {customer} = request;

    const balance = getBalance(customer.statement);

    return response.status(200).json(balance)
});


app.listen(3333)