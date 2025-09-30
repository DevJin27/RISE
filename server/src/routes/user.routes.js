import { Router } from "express"


const userRouter = Router()

userRouter.route('').get((req,response) =>response.status(200).send("User routes are working"))


export { userRouter }
