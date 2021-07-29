import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('before handler:', context);
    return next.handle().pipe(
      map((data) => {
        // console.log('before res is sent out:', data);
        delete data.password;
        return data;
      }),
    );
  }
}
