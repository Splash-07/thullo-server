import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dtos';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: CreateUserDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ email: dto.email });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return { message: 'User created successfully' };
  }

  async login(dto: LoginUserDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ email: dto.email });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    return { message: 'User logged in successfully' };
  }

  async updateUser(
    dto: UpdateUserDto,
    id: string,
  ): Promise<{ message: string }> {
    const userEmailExists = await this.findOneByEmail(dto.email);

    if (userEmailExists && userEmailExists.id !== id) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      await this.userRepository.update(
        { id },
        { ...dto, password: hashedPassword },
      );
    } else {
      await this.userRepository.update({ id }, dto);
    }

    return { message: 'User updated successfully' };
  }

  async getUser(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    await this.userRepository.delete({ id: userId });
    return { message: 'User deleted successfully' };
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async updateUserPhoto(photo: string, id: string): Promise<string> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    await this.userRepository.update({ id }, { photo: `/${photo}` });

    const updatedUser = await this.userRepository.findOne({ id });
    return updatedUser.photo;
  }
}
