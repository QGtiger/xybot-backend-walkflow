import { Body, Controller, Post } from '@nestjs/common';
import { WorkOrderConclusion } from './entities/work_order_conclusion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('workorder')
export class WorkOrderConclusionController {
  @InjectRepository(WorkOrderConclusion)
  private readonly workOrderConclusionRepository: Repository<WorkOrderConclusion>;

  @Post('create')
  createWorkOrderConclusion(
    @Body()
    body: {
      sessionId: string;
      userId: string;
      aiContent: string;
      finalContent: string;
    },
  ) {
    return this.workOrderConclusionRepository.save(body);
  }
}
