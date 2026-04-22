import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../infrastructure/persistence/typeorm/user.typeorm.entity';
import { LoginDto } from '../../presentation/dtos/login.dto';
import { RegisterDto } from '../../presentation/dtos/register.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = this.userRepository.create({ email: dto.email, passwordHash });
    await this.userRepository.save(user);
  }

  async login(dto: LoginDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    // Use constant-time comparison to prevent timing attacks
    const dummyHash = '$2b$12$invalidhashinvalidhashinvalidhashinvalid';
    const hashToCompare = user ? user.passwordHash : dummyHash;
    const valid = await bcrypt.compare(dto.password, hashToCompare);

    if (!user || !valid) throw new UnauthorizedException('Credenciales inválidas');

    return this.jwtService.signAsync({ sub: user.id, email: user.email });
  }

  async getMe(userId: number): Promise<{ id: number; email: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email };
  }
}
