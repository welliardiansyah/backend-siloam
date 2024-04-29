import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UnitEntity } from "./Unit.entity";

@Entity({ name: "vendor_siloam" })
export class VendorEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({default: false})
  is_active: boolean;

  @ManyToOne(() => UnitEntity, units => units.vendors)
  units: UnitEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}