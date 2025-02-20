import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/interface/User.interface';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('You are not authenticated');
    }

    if (user.role !== 'user') {
      throw new ForbiddenException('Access denied, user role is required');
    }

    return true;
  }
}
