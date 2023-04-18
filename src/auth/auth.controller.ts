import {
  Body,
  Controller,
  ValidationPipe,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { CredentialsDto } from './dtos/credentials.dto'
import { AuthGuard } from './auth.guard'

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

  @UseGuards(AuthGuard)
  @Get('/me')
  getProfile(@Request() req) {
    return req.user
  }
}
