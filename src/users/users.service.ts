import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    const user: User = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.repo.findOne(id);
  }

  find(email: string): any {
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
