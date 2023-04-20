import { Repository } from 'typeorm';
import { DespesasController } from './despesas.controller';
import { DespesasService } from './despesas.service';
import { Despesa } from './entities/despesa.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';

const mockDespesaRepository = jest.fn(() => ({
  save: jest.fn(),
}));

const mockUserRepository = jest.fn(() => ({
  save: jest.fn(),
}));

describe('Despesa Controller', () => {
  let despesasController: DespesasController;
  let despesasService: DespesasService;
  let despesasRepository: Repository<Despesa>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DespesasController],
      providers: [
        DespesasService,
        UsersService,
        {
          provide: getRepositoryToken(Despesa),
          useValue: mockDespesaRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    despesasController = module.get<DespesasController>(DespesasController);
    despesasRepository = module.get<Repository<Despesa>>(
      getRepositoryToken(Despesa),
    );
    despesasService = module.get<DespesasService>(DespesasService);
  });

  it('should be defined', () => {
    expect(despesasController).toBeDefined();
    expect(despesasService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new despesa', async () => {});
  });
});
