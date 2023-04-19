import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { User } from 'src/users/users.entity'
import { UsersService } from '../users/users.service'
import { CredentialsDto } from './dtos/credentials.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
    const { password } = credentialsDto
    const user = await this.userService.findUser(credentialsDto)

    if (user && (await user.checkPassword(password))) {
      const jwtPayload = {
        email: user.email,
        sub: user.id,
      }

      const token = await this.jwtService.signAsync(jwtPayload)

      return { token }
    }
    throw new UnauthorizedException('Credenciais inválidas')
  }
}
