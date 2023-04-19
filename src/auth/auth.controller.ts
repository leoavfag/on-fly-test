import {
  Body,
  Controller,
  ValidationPipe,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { CredentialsDto } from './dtos/credentials.dto'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { User } from 'src/users/users.entity'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.signUp(createUserDto)
    return {
      message: 'Cadastro realizado com sucesso',
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.signIn(credentiaslsDto)
  }

  @UseGuards(AuthGuard())
  @Get('/profile')
  getProfile(@Req() req): User {
    return req.user
  }
}
