import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderConclusion } from './entities/work_order_conclusion.entity';
import { WorkOrderConclusionController } from './workOrderConslusion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrderConclusion])],
  controllers: [WorkOrderConclusionController],
})
export class WorkOrderConclusionModule {}
