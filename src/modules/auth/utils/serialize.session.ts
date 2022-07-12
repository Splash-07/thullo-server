import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersSerivce: UsersService) {
    super();
  }
  serializeUser(user: User, done: (err, user: { id: string }) => void) {
    done(null, { id: user.id });
  }

  async deserializeUser(
    payload: User,
    done: (err, user: { id: string }) => void,
  ) {
    const user = await this.usersSerivce.findOneById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
