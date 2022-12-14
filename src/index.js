const express = require('express');
const { v4:uuidV4 } = require('uuid')

const app = express();

// Midware
app.use(express.json())


const customers = []

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
	const { cpf } = request.headers

	const customer = customers.find(customer => customer.cpf === cpf);

	if(!customer){
		return response.status(400).json({ error: "customer not found"})	
	}

	request.customer = customer
	
	return next()
}

function getBalance(statement) {
	const balance = statement.reduce((acc, operation)=>{
		if(operation.type=="credit"){
			return acc + operation.amount;
		}else {
			return acc - operation.amount
		}
	}, 0)

	return balance;
}

/* 
	cpf? string
	name? string
	id - uuid
	statement [Array] (extrato)
*/

app.post("/account", (request, response)=>{
	const { cpf, name } = request.headers

	const customerAlreadyExists = customers.some(
		(customer) => customer.cpf === cpf
	)

	if(customerAlreadyExists){
		return response.status(400).json({ error: "Customer Already Exists!" })
	}

	customers.push({
		cpf,
		name, 
		id: uuidV4(),
		statement: []
	});
	console.log(customers)

	return response.status(201).send()
},);

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
	const { cpf } = request.headers

	const customer = customers.find(customer => customer.cpf === cpf);

	if(!customer){
		return response.status(400).json({ error: "customer not found"})	
	}

	console.log(customer)

	return response.json(customer.statement) 
});

app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
	const {customer} = request
	const { date } = request.query

	const dateFormat = new Date(date + " 00:00")

	const statement = customer.statement.filter(
		((statement)=>
			statement.created_at.toDateString() === 
			new Date(dateFormat).toDateString()
		)
	)

	return response.json(statement) 
});


app.post("/deposit", verifyIfExistsAccountCPF, (request, response)=>{
	const { amount, description } = request.body;

	const { customer } = request
	
	const statementOperations = {
		description: description,
		amount: amount,
		created_at: new Date(),
		type: "credit"
	}

	customer.statement.push(statementOperations);

	return response.status(201).send();
})

app.post('/withdraw', verifyIfExistsAccountCPF, (request, response)=>{
	const { amount } = request.body;
	const { customer } = request

	const balance = getBalance(customer.statement)
	
	if(balance< amount){
		return response.status(400).json({ error: 'Insufficient funds!'})
	}

	const statementOperations = {
		amount: amount,
		created_at: new Date(),
		type: "debit"
	}	

	customer.statement.push(statementOperations);
	return response.status(201).send()
	
})

app.put('/account', verifyIfExistsAccountCPF, (request, response)=>{
	const { name } = request.body
	const { customer } = request

	customer.name = name

	return response.status(201).send()
})

app.get('/account', verifyIfExistsAccountCPF, (request, response)=>{
	const {customer} = request
	return response.status(200).json({customer})
})

app.delete('/account', verifyIfExistsAccountCPF, (request, response)=>{
	const { customer } = request

	//splice the customer
	customers.splice(customer, 1)

	return response.status(200).json(customers)
})

app.get('/balance', verifyIfExistsAccountCPF, (request, response)=>{
	const { customer } = request

	const balance = getBalance(customer.statement)

	return response.status(200).json(balance)
})

app.listen(8080);