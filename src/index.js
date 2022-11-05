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
		statement: []
	});
	console.log(customers)

	return response.status(201).send()
})

app.listen(8080);