import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from '@nestjs/passport'
import { ReturnUserDto } from './dtos/return-user-dto'
import { UpdateUserDto } from './dtos/update-users.dto'
import { User } from './users.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import { FindUsersQueryDto } from './dtos/find-users-query.dto'

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id)
    return {
      user,
      message: 'Usuário encontrado',
    }
  }

  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      )
    } else {
      return this.usersService.updateUser(updateUserDto, id)
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @GetUser() user: User) {
    if (user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      )
    }
    await this.usersService.deleteUser(id)
    return {
      message: 'Usuário deletado com sucesso',
    }
  }

  @Get()
  async findUsers(@Query() queryDto: FindUsersQueryDto) {
    const users = await this.usersService.findUsers(queryDto)
    return {
      users,
      message: 'Usuários encontrados',
    }
  }
}
