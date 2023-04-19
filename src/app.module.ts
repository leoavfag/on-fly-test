import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './configs/typeorm.config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';
import { DespesasModule } from './despesas/despesas.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, AuthModule, DespesasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
