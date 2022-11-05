const express = require('express');

const app = express();

// Midware
app.use(express.json())

//localhost:8080

// Tipos de parametros:
// 	*Route Params => (:id) Identificar um recurso Buscar/Deletar/Editar
// 	*Query Params => Paginação/Filtro de Busca/...
// 					([?chave="valor"&chave2] ou ) 
// }
// * body Params => Os objetos para inserção/alteração

app.get("/", (request, response)=>{
	return response.json({message: "Hello world"})
});

app.get("/courses", (request, response)=>{
	const query = request.query
	console.log(query)
	return response.json(["Curso 1", "Curso 2", "Curso 3"])
})

app.post("/courses", (request, response)=>{
	const body = request.body
	console.log(body)
	return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"])
})

app.put("/courses/:id", (request, response)=>{
	const { id } = request.params
	console.log(id)
	return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})

app.patch("/courses/:id", (request, response)=>{
	return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"])
})

app.delete("/courses/:id", (request, response)=>{
	return response.json(["Curso 6", "Curso 7", "Curso 4"])
})

app.listen(8080);