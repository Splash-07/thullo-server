import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { Session } from './entities/session.entity';
import { LocalStrategy } from './strategies';
import { SessionSerializer } from './utils/serialize.session';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Session]),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
