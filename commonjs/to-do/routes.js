
//import todos
import todos from "./db.js";

//http://localhost:3000 - default route
//http://localhost:3000/api/todos - return all todos
//http://localhost:3000/api/todos/1 - GET return todo with id of 1
//http://localhost:3000/api/todos - POST post todo with new id
//http://localhost:3000/api/todos/1 - DELETE delete todo with id of 1
//http://localhost:3000/api/todos/1 - PUT update todo with id of 1

//maintain the state of data by sprading the todos
let todoListData = [...todos]

const router = async (req, res) => {

    //destructure the req
    const { url, method } = req

    // lets create a helper function to send JSON response
    const sendJSONResponse = (statusCode, data) => {
        res.setHeader("Content-Type", "application/json")
        res.writeHead(statusCode)
        //get all todos and send them
        res.end(JSON.stringify(data));
    }


    //GET all todos
    if (url === "/api/todos" && method === "GET") {
        //     res.setHeader("Content-Type", "application/json")
        //     res.writeHead(200)
        //     //get all todos and send them
        //     res.end(JSON.stringify(todos));
        // }
        if (todoListData.length > 0) {
            sendJSONResponse(200, todoListData)
        } else {
            sendJSONResponse(400, { message: "Todos are empty" })
        }
    }

    //get a single todo api/todos/:id
    // url.match(/\/api\/todos\/\d+/): This checks if the requested URL matches the pattern /api/todos/ followed by one or more digits (\d+ is a regular expression that matches digits). This pattern ensures that the request is specifically asking for a todo by ID.
    // /api/todos/3 - this will match digit 3
    else if (url.match(/\/api\/todos\/\d+/) && method === "GET") {
        // 'http://localhost:3000/api/todos/2'.split("/")
        //     (6)['localhost:3000', 'api', 'todos', '2']
        const id = parseInt(url.split("/")[3])
        //find the todo that matches this id 
        const todo = todoListData.find((todo) => todo.id === id)

        if (todo) {
            sendJSONResponse(200, todo)
        } else {
            sendJSONResponse(400, { message: "Todo not found" })
        }
    }


    //POST a todo (create new todo)
    //make sure its a json data
    /**
     * {
      "title": "Call mom",
      "description": "Check in with mom and discuss weekend plans",
      "completed": false
}
     */
    else if (url === '/api/todos' && method === "POST") {
        let body = "" // we will store the request data
        req.on("data", chunk => { // req.on listnes incoming data as streams
            //append each data chunk to the body
            body += chunk.toString()
        })

        req.on("end", () => {
            //we have the data in  body
            //so we can destructure the properies
            const { title, description, completed } = JSON.parse(body)
            const newId = todoListData.length + 1
            const newTodo = {
                // id: uuid(),
                id: newId,
                title,
                description,
                completed,
            }
            todoListData.push(newTodo)
            sendJSONResponse(201, { message: 'new todo added', 'todo': newTodo })
        })
    }


    //we need to update a sepecific todo
    else if (url.match(/\/api\/todos\/\d+/) && method === "PUT") {
        const id = parseInt(url.split("/")[3])
        let body = "" // we will store the request data
        req.on("data", chunk => { // req.on listnes incoming data as streams
            //append each data chunk to the body
            body += chunk.toString()
        })

        req.on("end", () => {
            //we have the data in  body
            //so we can destructure the properies
            const { title, description, completed } = JSON.parse(body)
            const updateData = { title, description, completed }

            const todoIndex = todoListData.findIndex((todo) => todo.id === id)

            if (todoIndex !== -1) {
                const updateTodo = { ...todoListData[todoIndex], ...updateData }
                todoListData[todoIndex] = updateTodo
                sendJSONResponse(201, { message: 'new todo updated', 'todo': updateTodo })
            } else {
                sendJSONResponse(404, { message: 'Todo not found' })
            }
        })
    }


    // we need to delete a todo with a specific id
    else if (url.match(/\/api\/todos\/\d+/) && method === "DELETE") {
        const id = parseInt(url.split("/")[3])
        const todoIndex = todoListData.findIndex((todo) => todo.id === id)
        if (todoIndex !== -1) {
            todoListData = todoListData.filter((todo) => todo.id !== id)
            sendJSONResponse(201, { message: 'new todo deleted' })
        } else {
            sendJSONResponse(404, { message: 'Todo not found' })
        }
    }

    //if no route matched , send a 404 and a message route not found
    else {
        sendJSONResponse(404, { message: 'Route Not Found😒😒' })
    }

}

export default router

//localhost:8000/todos
//localhost:8000/todos/3
// clarifications 
//get the id dynamically instaed of static
