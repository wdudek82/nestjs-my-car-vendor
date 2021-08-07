import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    return req.currentUser;
  },
);
