import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersServices {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const userCacheKey = `providers-list:${user_id}`;

    // let users = await this.cacheProvider.recover<User[]>(userCacheKey);

    let users;
    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });
    }

    await this.cacheProvider.save(userCacheKey, classToClass(users));

    return users;
  }
}

export default ListProvidersServices;
