import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common'
import { DespesasService } from './despesas.service'
import { CreateDespesaDto } from './dto/create-despesa.dto'
import { UpdateDespesaDto } from './dto/update-despesa.dto'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../users/entities/users.entity'
import { GetUser } from '../auth/get-user.decorator'
import { BaseQueryParametersDto } from '../shared/base-query-parameters.dto'

@Controller('despesas')
@UseGuards(AuthGuard('jwt'))
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post('/create')
  async create(
    @Body(ValidationPipe) createDespesaDto: CreateDespesaDto,
    @GetUser() user: User,
  ) {
    const despesa = await this.despesasService.create(createDespesaDto, user)
    return {
      despesa: despesa,
      message: 'Cadastro realizado com sucesso',
    }
  }

  @Get()
  async findAll(
    @Query() queryDto: BaseQueryParametersDto,
    @GetUser() user: User,
  ) {
    const despesas = await this.despesasService.findAll(queryDto, user)
    return {
      despesas,
      message: 'Despesas encontradas',
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const despesa = this.despesasService.findOne(id)
    return {
      despesa,
      message: 'Despesa encontrada',
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body(ValidationPipe) updateDespesaDto: UpdateDespesaDto,
  ) {
    return this.despesasService.update(id, updateDespesaDto, user)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.despesasService.remove(id, user)
  }
}
