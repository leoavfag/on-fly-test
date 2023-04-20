import { Module } from '@nestjs/common'
import { DespesasService } from './despesas.service'
import { DespesasController } from './despesas.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Despesa } from './entities/despesa.entity'
import { PassportModule } from '@nestjs/passport'
import { User } from '../users/entities/users.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Despesa]),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}
