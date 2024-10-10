import { NextFunction, Request, Response } from "express";
import { getXataClient } from "../xata";
const xata = getXataClient();



interface CustomRequest extends Request {
    userFound: any;
    parsedID: number;
}

const ResolveUseByIndex = () => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const customReq = req as CustomRequest;
        const { params: { id } } = req;
        const eventID: number = parseInt(id);

        // Check if the event ID is a number
        if (isNaN(eventID)) {
            res.status(400).json({
                message: "ID is not a valid number",
            });
        }

        try {
            // Fetch the event from the database by its ID
            const { records } = await xata.sql`SELECT * FROM "events" WHERE id = ${eventID}`;

            // If no event is found, return 404
            if (records.length === 0) {
                res.status(404).json({
                    message: "Event not found",
                });
            }

            // Attach found event to the custom request object
            customReq.userFound = records[0];
            customReq.parsedID = eventID;

            // Proceed to the next middleware or route handler
            next();

        } catch (error: any) {
            res.status(500).json({
                message: "Error retrieving event data",
                error: error.message,
            });
        }
    };
};

export { CustomRequest, ResolveUseByIndex };


// import { NextFunction, Request, Response } from "express";

// type eventsData = {
//     id: number;
//     title: string;
//     date: string;
//     location: string;
//     imageUrl: string;
//     company: string;
//     price: number;
// };

// interface CustomRequest extends Request {
//     userFound: number
//     parsedID: number
//     // body: any
// }
// const ResolveUseByIndex = (eventsData: Array<eventsData>) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         // const m_id: string = req.params?.id ?? "
//         const customereq = req as CustomRequest

//         const { params: { id }
//         } = req
//         const { body } = req


//         const userid: number = parseInt(id)

//         const findIndex = eventsData.findIndex((userDataObj) => userDataObj.id === userid)

//         if (isNaN(userid)) {
//             res.status(400).json({
//                 Message: "Id Not a number"
//             })

//         } else if (findIndex === -1) {
//             res.status(404).json({
//                 Message: "User Not Found"
//             })
//         } else {
//             customereq.userFound = findIndex;
//             customereq.parsedID = userid;
//             customereq.body = body

//             next()

//             // const foundUser = userData[findIndex]
//             // res.status(200).json({
//             //     Message: "User Found",
//             //     data: foundUser
//         }
//     }
// }

// // ResolveUseByIndex()
// export { CustomRequest, eventsData, ResolveUseByIndex };

