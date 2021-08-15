import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.session ?? {};
    if (userId) {
      req.currentUser = await this.usersService.findById(userId);
    }
    next();
  }
}
