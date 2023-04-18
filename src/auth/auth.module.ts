import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/users.entity'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'super-secret',
      signOptions: {
        expiresIn: 18000,
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
