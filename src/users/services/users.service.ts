import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository) { }

    async findAll(paginationDto: PaginationDto) {
        try {
            const result = await this.usersRepository.findPaginated(paginationDto);

            return result;
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los usuarios');
        }
    }

}
