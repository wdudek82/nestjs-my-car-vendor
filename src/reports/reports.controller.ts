import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { Report } from './entities/report.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/foo')
  foo(): string {
    return 'GET /reports';
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return await this.reportsService.create(createReportDto);
  }
}
