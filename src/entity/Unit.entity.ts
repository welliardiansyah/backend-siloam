import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VendorEntity } from "./Vendor.entity";

@Entity({ name: "unit_siloam" })
export class UnitEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({default: false})
  is_active: boolean;

  @OneToMany(() => VendorEntity, vendor => vendor.units)
  vendors: VendorEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}