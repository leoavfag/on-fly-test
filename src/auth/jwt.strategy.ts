import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { PassportStrategy } from '@nestjs/passport'
import { Repository } from 'typeorm'
import { User } from 'src/users/users.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret',
    })
  }

  async validate(payload) {
    const { sub, email } = payload
    const user = await this.userRepository.findOne({
      where: { id: sub },
      select: ['name', 'email'],
    })
    if (!user) {
      throw new UnauthorizedException('Usuario não encontrado')
    }
    return user
  }
}
