import { Module } from '@nestjs/common';
import { WalkflowService } from './walkflow.service';
import { WalkflowController } from './walkflow.controller';
import { UserWalkflows } from './entities/user_walkflows.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserWalkflows])],
  controllers: [WalkflowController],
  providers: [WalkflowService],
})
export class WalkflowModule {}
