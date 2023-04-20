import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer'
import { Despesa } from '../../despesas/entities/despesa.entity'

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

  @OneToMany(() => Despesa, (despesa) => despesa.user)
  despesas: Despesa[]

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
