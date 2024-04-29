import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { encrypt } from "../helpers/encrypt";
import { UserEntity } from "../entity/User.entity";
import { UserLoginDto } from "../dto/User.Dto";

export class UserController {
    static async registerUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            const userRepository = AppDataSource.getRepository(UserEntity);

            const getUsers = await userRepository.findOne({ where: { email } });
            if (getUsers) {
                return res.status(404).json({ message: "Email already exist!." });
            }

            const encryptedPassword = await encrypt.encryptpass(password);

            const user = new UserEntity();
            user.name = name;
            user.email = email;
            user.password = encryptedPassword;
            const saveData = await userRepository.save(user);
            delete saveData["password"];

            const result = new UserLoginDto()
            result.name = user.name;
            result.email = user.email;
            const token = encrypt.generateToken({
                id: user.id,
                name: user.name,
                email: user.email
            });

            return res.status(200).json({ message: "User berhasil untuk dibuat!.", data: saveData, token });
        } catch (error) {
            console.error("Error in registering user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;
            const userRepository = AppDataSource.getRepository(UserEntity);
            const user = await userRepository.findOne({where: { id } });
            user.name = name;
            user.email = email;
            await userRepository.save(user);
            res.status(200).json({ message: "User Berhasil untuk diubah!.", data: user });
        } catch (error) {
            console.error("Error in registering user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userRepository = AppDataSource.getRepository(UserEntity);
            const user = await userRepository.findOne({where: { id } });
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await userRepository.softDelete(id);
    
            return res.status(200).json({ message: "User berhasil untuk dihapus!", data: user });
        } catch (error) {
            console.error("Error in deleting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
