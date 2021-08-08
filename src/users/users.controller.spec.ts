import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [
      {
        id: 1,
        email: 'test@test.com',
        password: 'passwd123',
      } as User,
    ];
    fakeUsersService = {
      findById: (id: number): Promise<User> => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'passwd123',
        } as User);
      },
      find: (email: string): Promise<User[]> => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'passwd123',
          } as User,
        ]);
      },
      // remove: (id: number): Promise<User> => {
      //   return Promise.resolve({
      //     id,
      //     email: 'test@test.com',
      //     password: 'passwd123',
      //   } as User);
      // },
      // update: (id: number, updateUserDto: UpdateUserDto): Promise<User> => {
      //   return Promise.resolve({
      //     id,
      //     email: updateUserDto.email,
      //     password: updateUserDto.password,
      //   } as User);
      // },
    };
    fakeAuthService = {
      signin: (email: string, password: string): Promise<User> => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signup: (email: string, password: string): Promise<User> => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const email = 'test@test.com';
    const users = await controller.findAllUsers(email);
    const expectedUser = {
      id: 1,
      email,
      password: 'passwd123',
    } as User;
    expect(users).toEqual([expectedUser]);
  });

  it('findUser returns a single user with the given id', async () => {
    const id = '1';
    const user = await controller.findUser(id);
    const expectedUser = {
      id: +id,
      email: 'test@test.com',
      password: 'passwd123',
    } as User;

    expect(user).toEqual(expectedUser);
  });

  it('findUser throws an error if user with given id is not found', async (done) => {
    fakeUsersService.findById = () => null;

    try {
      await controller.findUser('1');
    } catch (err) {
      done();
      expect(err.response).toEqual({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }
  });

  it('signIn returns a user ...', async () => {
    const id = 1;
    const email = 'test@test.com';
    const password = 'password';
    const session = { userId: null };
    const user = await controller.signIn(
      { email, password } as CreateUserDto,
      session,
    );
    const expectedUser = {
      id,
      email,
      password,
    };

    expect(user).toEqual(expectedUser);
    expect(session.userId).toBe(id);
  });
});
