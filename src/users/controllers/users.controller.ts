import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'get user pagination' })
  findAllPagination(@Payload() data: { paginationDto: { paginationDto: PaginationDto, token: string }, token: string }) {
    const { paginationDto } = data;
    return this.usersService.findAll(paginationDto.paginationDto);
  }
}
