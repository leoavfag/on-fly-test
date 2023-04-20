import { User } from '../../users/entities/users.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Despesa extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false, type: 'varchar', length: 191 })
  descricao: string

  @Column({ nullable: false, type: 'date' })
  date: Date

  @ManyToOne(() => User, (user) => user.despesas)
  user: User

  @Column({ nullable: false, type: 'decimal' })
  valor: number
}
