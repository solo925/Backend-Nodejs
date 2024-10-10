import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { readFileSync } from "fs";
import path from "path";
import { CustomRequest, ResolveUseByIndex, userData } from "./middlewares/resolveUserByIndex";

dotenv.config();

// Inference
const app: Express = express();
const port = process.env.PORT || 3000; // Default to port 3000 if not specified

//midle wares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Get the current directory
const _dirname = path.resolve();



// Synchronously read the file
const eventData = readFileSync(
    path.join(_dirname, "src", "db", "eventsData.json"),
    "utf-8"
);

// Health check
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// Handles data from event data
app.get("/api/events", (req: Request, res: Response) => {
    res.send(eventData);
});

// Faker database for demonstration
const userData = [
    { userID: 1, userName: "alamin", displayName: "alamin254" },
    { userID: 2, userName: "Emmanuel", displayName: "emm254" },
    { userID: 3, userName: "Kevin", displayName: "kev254" },
    { userID: 4, userName: "John", displayName: "john254" },
];

//routing params
//api/users/:id - http://localhost:3000/api/users/1
app.get("/api/v1/users", (req: Request, res: Response) => {
    res.send(userData);
});

// Routing parameters to get a particular user by idrE
app.get("/api/v1/users/:id", ResolveUseByIndex(userData), (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    if (!customReq.userFound) {
        res.status(404).json({
            message: "Data not available",
        });
    } else {
        //return the data found
        res.status(201).json({
            message: "User Found",
            data: userData[customReq.userFound],
        });
    }
});

//POST Request
app.post("/api/v1/users", (req: Request, res: Response) => {
    //lets destrure the income body req
    //const body = req.body
    //const userName = req.body.userName
    const { body } = req;
    //if the userData is empty, the id will be 1 else we will add 1  to ther length
    const newID =
        userData.length > 0 ? userData[userData.length - 1].userID + 1 : 1;

    //push the object data to userData
    const newData = { id: newID, ...body };
    userData.push(newData);

    res.status(201).json({
        message: "Successfull post",
        payload: newData,
    });
});

/**
 * {
    "message": "Successfull post",
    "payload": {
        "id": 5,
        "userName": "alamin",
        "displayName": "alamin254"
    }
}
 */

//PUT requests - will replace the entire resource, 
// the body has everything even if not modified

//PATCH - only the fields need to be changed wuill be in the request body 
app.put("/api/v1/users/:id", ResolveUseByIndex(userData), (req: Request, res: Response) => {
    //get the id from the re
    const cusomereq = req as CustomRequest;
    if (cusomereq.userFound) {
        userData[cusomereq.userFound] = { userID: cusomereq.parsedID, ...req.body }
        res.status((200)).json(
            {
                message: "user added successfully"
            }
        )
    } else {
        res.status(404).json(
            {
                message: "user not found"
            }
        )
    }
});






//PATCH - only the fields need to be changed wuill be in the request body 
app.patch("/api/v1/users/:id", (req: Request, res: Response) => {
    //get the id from the parameter
    const { id } = req.params;

    //get the key-values from the req.body
    const { body } = req;

    //parse the incoming id from reqq into a string
    const parsedID = parseInt(id);

    //find the user to be updated by gettinbg their indexPositin
    // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
    // http://localhost:3000/api/v1/users/3
    const findUserIndex = userData.findIndex(
        (userObj) => userObj.userID === parsedID
    );

    //minial validations
    if (isNaN(parsedID)) {
        res.status(400).json({
            message: "ID not a number",
        });
    }
    //if the user is not available put error
    // http://localhost:3000/api/v1/users/33
    else if (findUserIndex === -1) {
        res.status(404).json({
            message: "User unavailable",
        });
    } else {
        //update the data object where userIndex matches the parsed id
        //update partially
        userData[findUserIndex] = { ...userData[findUserIndex], ...body };
        //return the status back to client
        res.send(200);
    }
});



//delete
//PATCH - only the fields need to be changed wuill be in the request body 
app.delete("/api/v1/users/:id", (req: Request, res: Response) => {
    //get the id from the parameter
    const { id } = req.params;

    //parse the incoming id from reqq into a string
    const parsedID = parseInt(id);

    //find the user to be updated by gettinbg their indexPositin
    // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
    // http://localhost:3000/api/v1/users/3
    const findUserIndex = userData.findIndex(
        (userObj) => userObj.userID === parsedID
    );

    //minial validations
    if (isNaN(parsedID)) {
        res.status(400).json({
            message: "ID not a number",
        });
    }
    //if the user is not available put error
    // http://localhost:3000/api/v1/users/33
    else if (findUserIndex === -1) {
        res.status(404).json({
            message: "User unavailable",
        });
    } else {
        //use splice to delete from the array 
        userData.splice(findUserIndex, 1)
        //return the status back to client
        res.status(200).json({
            message: "Data deleted successfully"
        })
    }
});


// Start the server
app.listen(port, () => {
    console.log(
        `[server]: Server TypeScript is running at http://localhost:${port} 😂😂😂😂`
    );
});

/*
Error: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (node:_http_outgoing:659:11)
    at ServerResponse.header (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:794:10)
    at ServerResponse.send (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:174:12)
    at ServerResponse.json (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:278:15)
    at ServerResponse.send (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:162:21)
    at C:\dev\QA-QE\4.Node\5.express\1.queryParams\src\server.ts:55:7
    at Layer.handle [as handle_request] (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\layer.js:95:5)       
    at next (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\layer.js:95:5)  


     if (filter && value) {
    const filteredData = userData.filter((userObject) => {
      return (userObject[filter as keyof typeof userObject]?.toString() || "").toLowerCase().includes(value.toLowerCase())
    })
    res.send(filteredData)
  }

  res.send(userData);
    its saying I run two request endpoits at the same both the if statement and after if
    //we need to add an else 
    // try - catch 
    */
