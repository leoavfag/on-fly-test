import { Exclude } from 'class-transformer'
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string

  @Column({ nullable: false, type: 'varchar' })
  password: string

  @Column({ nullable: false })
  salt: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
