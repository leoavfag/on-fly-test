import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { User } from './users.entity'
import { CreateUserDto } from './dtos/create-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, passwordConfirmation } = createUserDto

    if (password != passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem')
    } else {
      const user = new User()
      user.email = email
      user.name = name
      user.salt = await bcrypt.genSalt()
      user.password = await this.hashPassword(password, user.salt)
      try {
        await this.userRepository.save(user)
        delete user.password
        delete user.salt
        return user
      } catch (error) {
        if (error.code.toString() === '23505') {
          throw new ConflictException('Endereço de email já está em uso')
        } else {
          throw new InternalServerErrorException(
            'Erro ao salvar o usuário no banco de dados',
          )
        }
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
