import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

const mockUserRepository = jest.fn(() => ({
  checkPassword: jest.fn(),
  save: jest.fn(),
}));

describe('UsersController', () => {
  let userController: UsersController;
  let userRepository: Repository<User>;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateUserDto: CreateUserDto;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'mock@email.com',
        name: 'Mock User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should create a user if passwords match', async () => {
      userService.createUser = jest.fn().mockResolvedValue('mockUser');
      const result = await userService.createUser(mockCreateUserDto);

      expect(userService.createUser).toBeCalledWith(mockCreateUserDto);
      expect(result).toBe('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';
      expect(userService.createUser(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw an error if user already exists', async () => {
      let error = { code: '23505' };
      userRepository.save = jest.fn().mockRejectedValue(error);
      expect.assertions(1);
      try {
        await userService.createUser(mockCreateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('findUserById', () => {
    it('should return the found user', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue('mockUser');

      const result = await userService.findUserById('mockId');
      const select = ['email', 'name', 'id'];
      expect(userRepository.findOne).toHaveBeenCalledWith({
        select,
        where: { id: 'mockId' },
      });
      expect(result).toEqual('mockUser');
    });

    it('should throw an error as user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(userService.findUserById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should return affected > 0 if user is deleted', async () => {
      userRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await userService.deleteUser('mockId');
      expect(userRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('should throw an error if no user is deleted', async () => {
      userRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      expect(userService.deleteUser('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findUsers', () => {
    it('should call the findUsers method of the userRepository', async () => {
      userService.findUsers = jest.fn().mockResolvedValue('resultOfsearch');
      const mockFindUsersQueryDto: FindUsersQueryDto = {
        name: '',
        email: '',
        limit: 1,
        page: 1,
        sort: '',
      };
      const result = await userService.findUsers(mockFindUsersQueryDto);
      expect(userService.findUsers).toHaveBeenCalledWith(mockFindUsersQueryDto);
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('updateUser', () => {
    const mockUpdateUserDto = { name: 'mock', email: 'mock@email.com' };

    it('should return affected > 0 if user data is updated and return the new user', async () => {
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      userRepository.findOne = jest.fn().mockResolvedValue('mockUser');

      const result = await userService.updateUser(mockUpdateUserDto, 'mockId');
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateUserDto,
      );
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if no row is affected in the DB', async () => {
      userRepository.update = jest.fn().mockResolvedValue({ affected: 0 });

      expect(
        userService.updateUser(mockUpdateUserDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
