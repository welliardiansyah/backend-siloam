import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ILike, Like } from "typeorm";
import { VendorEntity } from "../entity/Vendor.entity";

export class VendorController {
    static async createdVendor(req: Request,  res: Response) {
        const { name, is_active, unitsId } = req.body;
        const vendorRepository = AppDataSource.getRepository(VendorEntity);

        const getByName = await vendorRepository.findOne({ where: { name: ILike(`%${name}%`) } });
        if (getByName) {
            return res.status(400).json({ message: "Nama vendor ini sudah tersedia!." });
        }
        try {
            const createObjData = new VendorEntity();
            createObjData.name = name;
            createObjData.is_active = is_active;
            createObjData.units = unitsId;

            const saveData = await vendorRepository.save(createObjData);
            return res.status(200).json({ message: "Berhasil membuat data vendor!.", data: saveData });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateVendor(req: Request, res: Response) {
        const { id } = req.params;
        const { name, is_active, unitsId } = req.body;
        try {
            const vendorRepository = AppDataSource.getRepository(VendorEntity);
            const vendors = await vendorRepository.findOne({where: { id } });
            vendors.name = name;
            vendors.is_active = is_active;
            vendors.units = unitsId;

            if (!vendors) {
                return res.status(400).json({ message: "Data vendor ini tidak dapat ditemukan!." });
            }
            const checkExist = await vendorRepository.findOne({ where: { name: ILike(`%${name}%`) } });
            if (checkExist) {
                return res.status(400).json({ message: "Nama vendor ini sudah tersedia!." });
            }

            const saveData = await vendorRepository.save(vendors);
            return res.status(200).json({ message: "Berhasil merubah data vendor!.", data: saveData });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteVendor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vendorRepository = AppDataSource.getRepository(VendorEntity);
            const vendors = await vendorRepository.findOne({where: { id } });
    
            if (!vendors) {
                return res.status(404).json({ message: "vendors not found" });
            }
            await vendorRepository.softDelete(id);
    
            return res.status(200).json({ message: "Data vendor berhasil untuk dihapus!", data: vendors });
        } catch (error) {
            console.error("Error in deleting vendors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const vendorRepository = AppDataSource.getRepository(VendorEntity);
            const vendors = await vendorRepository.createQueryBuilder('vendor')
                .orderBy('vendor.name', 'ASC')
                .getMany();
    
            return res.status(200).json({ message: "Data vendor berhasil untuk dihapus!", data: vendors });
        } catch (error) {
            console.error("Error in deleting vendors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async Listting(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1 | 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10 | 10;
            const search = req.query.search ? String(req.query.search) : '';
    
            const vendorRepository = AppDataSource.getRepository(VendorEntity);
            const skip = (page - 1) * limit;
    
            const [vendors, totalCount] = await vendorRepository.findAndCount({
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
                data: vendors,
            });
        } catch (error) {
            console.error("Error in getting vendors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}