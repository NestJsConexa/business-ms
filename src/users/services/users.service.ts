import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository) { }

}
