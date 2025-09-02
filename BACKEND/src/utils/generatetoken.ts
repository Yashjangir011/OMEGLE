import jwt from 'jsonwebtoken'
import { Response } from 'express';

const generate_token = (email :string , res : Response)  => {
    const token = jwt.sign({email} , process.env.SECRET_CODE as string , { expiresIn: "15d" })

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      });
    
}

export default generate_token