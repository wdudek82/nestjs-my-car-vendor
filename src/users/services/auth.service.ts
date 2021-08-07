import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string): Promise<User> {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('E-mail in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);
    if (!user) {
      throw new BadRequestException('User was not created');
    }
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect password');
    }

    return user;
  }
}
