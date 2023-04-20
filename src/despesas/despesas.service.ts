import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateDespesaDto } from './dto/create-despesa.dto'
import { UpdateDespesaDto } from './dto/update-despesa.dto'
import { Despesa } from './entities/despesa.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/users.entity'
import { UsersService } from 'src/users/users.service'
import { BaseQueryParametersDto } from 'src/shared/base-query-parameters.dto'

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UsersService,
  ) {}

  async create(
    createDespesaDto: CreateDespesaDto,
    user: User,
  ): Promise<Despesa> {
    const { descricao, date, valor } = createDespesaDto

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    const despesa = new Despesa()
    despesa.descricao = descricao
    despesa.date = date
    despesa.valor = valor
    despesa.user = user

    try {
      await this.despesaRepository.save(despesa)
      return despesa
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        'Erro ao salvar o despesa no banco de dados',
      )
    }
  }

  async findAll(
    queryDto: BaseQueryParametersDto,
    user: User,
  ): Promise<{ despesas: Despesa[]; total: number }> {
    queryDto.page = queryDto.page < 1 || !queryDto.page ? 1 : queryDto.page
    queryDto.limit =
      queryDto.limit > 100 || !queryDto.limit ? 100 : queryDto.limit
    const { id } = user

    const query = this.despesaRepository.createQueryBuilder('despesa')

    query.andWhere('despesa.userId = :id', { id: `${id}` })

    query.skip((queryDto.page - 1) * queryDto.limit)
    query.take(queryDto.limit)
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined)
    query.select([
      'despesa.id',
      'despesa.descricao',
      'despesa.date',
      'despesa.valor',
    ])

    const [despesas, total] = await query.getManyAndCount()

    return { despesas, total }
  }

  async findOne(id: string) {
    const despesa = await this.despesaRepository.findOne({
      where: { id: id },
      select: ['id', 'descricao', 'date', 'valor'],
    })

    if (!despesa) throw new NotFoundException('Despesa não encontrado')

    return despesa
  }

  async update(id: string, updateDespesaDto: UpdateDespesaDto, user: User) {
    this.checkPermission(user, id)

    const result = await this.despesaRepository.update({ id }, updateDespesaDto)

    if (result.affected > 0) {
      const despesa = await this.findOne(id)
      return despesa
    }
    throw new NotFoundException('Despesa não encontrada')
  }

  async remove(id: string, user: User) {
    this.checkPermission(user, id)

    const result = await this.despesaRepository.delete({ id: id })
    if (result.affected === 0) {
      throw new NotFoundException('Despesa não encontrada')
    }
  }

  private async checkPermission(user: User, id: string) {
    const despesa = await this.despesaRepository.findOne({ where: { id: id } })

    if (!despesa) {
      throw new NotFoundException('Despesa não encontrado')
    }

    const despesaUserId = despesa.user.id

    if (user.id !== despesaUserId) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      )
    }
  }
}
