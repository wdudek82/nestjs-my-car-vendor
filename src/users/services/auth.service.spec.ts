import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string): Promise<User[]> => {
        const filteredUsers = users.filter((u) => u.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string): Promise<User> => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const password = 'asdf';
    const user = await service.signup('asdf@asdf.com', password);
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async (done) => {
    const email = 'test@test.com';
    const password = 'password123';
    await service.signup(email, password);

    try {
      await service.signup(email, password);
    } catch (err) {
      done();
      expect(err.response.error).toBe('Bad Request');
      expect(err.response.statusCode).toBe(400);
      expect(err.response.message).toBe('E-mail in use');
    }
  });

  it('throws an error if user signin with an unused email', async (done) => {
    const email = 'test@test.com';
    const password = 'password123';

    try {
      await service.signin(email, password);
    } catch (err) {
      done();
      expect(err.response.error).toBe('Not Found');
      expect(err.response.statusCode).toBe(404);
      expect(err.response.message).toBe('User not found');
    }
  });

  it('throws an error if invalid password is provided', async (done) => {
    const email = '@';
    const password = 'password';
    const password2 = 'abcdefg';
    await service.signup(email, password);

    try {
      await service.signin(email, password2);
    } catch (err) {
      done();
      expect(err.response).toEqual({
        message: 'Incorrect password',
        statusCode: 400,
        error: 'Bad Request',
      });
    }
  });

  it('returns a user if correct password is provided', async () => {
    const password = 'password1';
    await service.signup('@', password);
    const user = await service.signin('@', password);
    expect(user).toBeDefined();
  });
});
