const express = require('express')
const cors = require('cors')
/* const http = require('http') */

const app = express()

app.use(cors())
app.use(express.json())

const logger = (request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('-----')
  next()
}
app.use(logger)

let notes = [
  {
    id: 1,
    content: 'HTML is easy but you cant xD',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

// Esto es para el require http
/* const app = http.createServer((request, response) =>{
    response.writeHead(200, { 'Content-Type' : 'application/json' })
    response.end(JSON.stringify(notes))
}) */

// Ahora con express
app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(notaUnica => notaUnica.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(notaUnica => notaUnica.id !== id) // Filtramos en las NOTAS (archivos json creado arriba) todas las notas menos la que tiene ID. Entonces se mostrarian todas menos la que quiero eliminar
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
