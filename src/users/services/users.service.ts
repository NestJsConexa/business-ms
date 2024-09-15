import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository) { }

    async findAll(paginationDto: PaginationDto) {
        return this.usersRepository.findPaginated(paginationDto);
    }

}
