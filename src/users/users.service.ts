import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from 'src/auth/dtos/credentials.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.page = queryDto.page < 1 || !queryDto.page ? 1 : queryDto.page;
    queryDto.limit =
      queryDto.limit > 100 || !queryDto.limit ? 100 : queryDto.limit;

    const { name, email } = queryDto;
    const query = this.userRepository.createQueryBuilder('user');

    if (name) query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    if (email)
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.id']);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, passwordConfirmation } = createUserDto;

    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    }

    const user = new User();
    user.email = email;
    user.name = name;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await this.userRepository.save(user);
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      const conflictErrorCode = '23505';
      if (error.code.toString() === conflictErrorCode) {
        throw new ConflictException('Endereço de email já está em uso');
      }
      throw new InternalServerErrorException(
        'Erro ao salvar o usuário no banco de dados',
      );
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email', 'name', 'id', 'despesas'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const result = await this.userRepository.update({ id }, updateUserDto);

    if (result.affected > 0) {
      const user = await this.findUserById(id);
      return user;
    }
    throw new NotFoundException('Usuário não encontrado');
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0)
      throw new NotFoundException('Usuário não encontrado');
  }

  async findUser(credentialsDto: CredentialsDto): Promise<User | undefined> {
    const { email } = credentialsDto;
    return await this.userRepository.findOne({ where: { email } });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
