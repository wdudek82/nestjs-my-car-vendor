import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../services/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.session ?? {};
    if (userId) {
      req['currentUser'] = await this.usersService.findById(userId);
    }
    next();
  }
}
