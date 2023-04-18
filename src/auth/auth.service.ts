import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { User } from 'src/users/users.entity'
import { UsersService } from '../users/users.service'
import { CredentialsDto } from './dtos/credentials.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userService.checkCredentials(credentialsDto)

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const jwtPayload = {
      id: user.id,
    }
    const token = await this.jwtService.sign(jwtPayload)

    return { token }
  }
}
