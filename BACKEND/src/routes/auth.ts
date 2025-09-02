import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import generate_token from "../utils/generatetoken.js";
import isLogged from "../middleware/isLogged.js";
const router = express.Router();
import { log } from "console";
import { WebSocket, WebSocketServer } from "ws";


const client = new PrismaClient();

interface User_model {
  username: string;
  password: string;
  email: string;
  sex: string;
  age: number;
  state: string;
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, email, sex, age, state } = req.body as User_model;

    if (!username || !password || !email || !sex || !age || !state) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // if we are using findunique than that field also considered to be unique inside the model else it gave us error
    const check_for_banned_email = await client.block.findUnique({ 
      where: {
        Email: email
      }
    });

    if (check_for_banned_email) {
        return res.status(400).json({
        success: false,
        message: "Email is banned"
      });
    }

    const exist_user_check = await client.user.findUnique({
      where: {
         Email : email 
        }
    });

    if (exist_user_check) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    generate_token(email , res);

    const user_Created = await client.user.create({
      data: {
        Username : username,
        Password: hashPassword,
        Email : email,
        Sex : sex,
        Age : age,
        State : state
      }
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user_Created.id,
        username: user_Created.Username,
        email: user_Created.Email,
        sex: user_Created.Sex,
        age: user_Created.Age,
        state: user_Created.State
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


router.post('/login' , async (req : Request , res : Response)=> {
    try{
        const {email , password} = req.body as User_model;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
        });
    }
        const existing_user = await client.user.findUnique({
            where: {
                Email : email
            }
        });

        if(!existing_user){
            return res.status(400).json({
                success : false,
                message : "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, existing_user.Password);
        if(!isMatch){
            return res.status(401).json({
                success : false,
                message : "Invalid credentials"
            });  
        }

        generate_token(email, res);

        return res.status(200).json({
            success : true,
            message : "User logged in successfully",
            user : {
                id : existing_user.id,
                username : existing_user.Username,
                email : existing_user.Email,
                sex : existing_user.Sex,
                age : existing_user.Age,
                state : existing_user.State
            }
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal server error",
        });
    }
})



router.get('/logout' , isLogged , async(req : Request , res : Response) =>{
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // set expiration to past date to clear cookie
    });
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(200).json({
      messagae: "internal server error",
    });
  }
})

export default router;