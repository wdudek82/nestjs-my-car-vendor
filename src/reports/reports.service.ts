import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/entities/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report: Report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  reports(user: User): Promise<Report[]> {
    return this.repo.find({ user });
  }

  async findById(id: number): Promise<Report> {
    if (!id) {
      throw new NotFoundException('Report not found');
    }
    return await this.repo.findOne(id);
  }

  async changeApproval(id: number, approved: boolean): Promise<Report> {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  createEstimate(estimateDto: GetEstimateDto): Promise<{ price: number }> {
    const { make, model, year, mileage, lng, lat } = estimateDto;
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
