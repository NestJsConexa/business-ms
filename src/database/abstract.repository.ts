import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { PaginationDto } from 'src/users/dto/pagination.dto';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) { }

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }

  async findPaginated(paginationDto: PaginationDto): Promise<{
    documents: TDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { email, page = 1, limit = 10 } = paginationDto;

    const filter: any = {};
    if (email) {
      filter.email = new RegExp(email, 'i');
    }

    const skip = (page - 1) * limit;

    const documents = await this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .lean<TDocument[]>(true);

    const total = await this.model.countDocuments(filter);

    return {
      documents,
      total,
      page,
      limit,
    };
  }




}