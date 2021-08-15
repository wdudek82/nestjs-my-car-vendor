import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { Report } from './entities/report.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto): Promise<User> | GetEstimateDto {
    return query;
  }

  @Get('')
  reports(@CurrentUser() user: User): Promise<Report[]> {
    return this.reportsService.reports(user);
  }

  @Get('/:id')
  async reportById(@Param('id') id: string): Promise<Report> {
    const report = this.reportsService.findById(+id);
    if (!report) {
      throw new NotFoundException('User not found');
    }
    return await report;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return await this.reportsService.create(createReportDto, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ): Promise<Report> {
    return this.reportsService.changeApproval(+id, approveReportDto.approved);
  }
}
