import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { UnitEntity } from "../entity/Unit.entity";
import { ILike, Like } from "typeorm";

export class UnitController {
    static async createdUnit(req: Request,  res: Response) {
        const { name, is_active } = req.body;
        const unitRepository = AppDataSource.getRepository(UnitEntity);

        const getByName = await unitRepository.findOne({ where: { name: ILike(`%${name}%`) } });
        if (getByName) {
            return res.status(400).json({ message: "Nama unit ini sudah tersedia!." });
        }
        try {
            const createObjData = new UnitEntity();
            createObjData.name = name;
            createObjData.is_active = is_active;

            const saveData = await unitRepository.save(createObjData);
            return res.status(200).json({ message: "Berhasil membuat data unit!.", data: saveData });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateUnit(req: Request, res: Response) {
        const { id } = req.params;
        const { name, is_active } = req.body;
        try {
            const unitRepository = AppDataSource.getRepository(UnitEntity);
            const units = await unitRepository.findOne({where: { id } });
            units.name = name;
            units.is_active = is_active;

            if (!units) {
                return res.status(400).json({ message: "Data unit ini tidak dapat ditemukan!." });
            }
            const checkExist = await unitRepository.findOne({ where: { name: ILike(`%${name}%`) } });
            if (checkExist) {
                return res.status(400).json({ message: "Nama unit ini sudah tersedia!." });
            }

            const saveData = await unitRepository.save(units);
            return res.status(200).json({ message: "Berhasil merubah data unit!.", data: saveData });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteUnit(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const unitRepository = AppDataSource.getRepository(UnitEntity);
            const units = await unitRepository.findOne({where: { id } });
    
            if (!units) {
                return res.status(404).json({ message: "units not found" });
            }
            await unitRepository.softDelete(id);
    
            return res.status(200).json({ message: "Data unit berhasil untuk dihapus!", data: units });
        } catch (error) {
            console.error("Error in deleting units:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const unitRepository = AppDataSource.getRepository(UnitEntity);
            const units = await unitRepository.createQueryBuilder('unit')
                .orderBy('unit.name', 'ASC')
                .getMany();
    
            return res.status(200).json({ message: "Data unit berhasil untuk dihapus!", data: units });
        } catch (error) {
            console.error("Error in deleting units:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async Listting(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1 | 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10 | 10;
            const search = req.query.search ? String(req.query.search) : '';
    
            const unitRepository = AppDataSource.getRepository(UnitEntity);
            const skip = (page - 1) * limit;
    
            const [units, totalCount] = await unitRepository.findAndCount({
                where: search ? { name: Like(`%${search}%`) } : {},
                order: { name: 'ASC' },
                skip,
                take: limit,
            });
    
            const totalPages = Math.ceil(totalCount / limit);
    
            return res.status(200).json({
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                data: units,
            });
        } catch (error) {
            console.error("Error in getting units:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}