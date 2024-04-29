import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { encrypt } from "../helpers/encrypt";
import { UserEntity } from "../entity/User.entity";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const userRepository = AppDataSource.getRepository(UserEntity);
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const isPasswordValid = encrypt.comparepassword(user.password, password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
    
            const token = encrypt.generateToken({
                id: user.id,
                name: user.name,
                email: user.email
            });
    
            return res.status(200).json({ message: "Login successful!.", data: user, token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getProfile(req: Request, res: Response) {
        if (!req["users"]) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({
          where: { id: req["users"].id },
        });
        return res.status(200).json({message: "Get profile successfully!.", data: user, password: undefined });
      }
}
