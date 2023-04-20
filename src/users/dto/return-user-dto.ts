import { User } from '../entities/users.entity';

export class ReturnUserDto {
  user: User;
  message: string;
}
