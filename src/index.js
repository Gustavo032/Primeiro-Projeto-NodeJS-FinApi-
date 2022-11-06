const express = require('express');
const { v4:uuidV4 } = require('uuid')

const app = express();

// Midware
app.use(express.json())

/* 
	cpf? string
	name? string
	id - uuid
	statement [Array] (extrato)
*/
const customers = []

app.post("/account", (request, response)=>{
	const { cpf, name } = request.body

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
		statement: [123]
	});
	console.log(customers)

	return response.status(201).send()
},);

app.get('/statement',(request, response) => {
	const {cpf} = request.headers

	const customer = customers.find(customer => customer.cpf === cpf);

	if(!customer){
		return response.status(400).json({ error: "customer not found"})	
	}

	console.log(customer)

	return response.json(customer.statement)
});


app.listen(8080);