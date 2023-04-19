import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string

  @Exclude()
  @Column({ nullable: false, type: 'varchar' })
  password: string

  @Column({ nullable: false })
  salt: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
