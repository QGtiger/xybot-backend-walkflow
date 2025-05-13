import { Controller, Get, Param } from '@nestjs/common';
import { WalkflowService } from './walkflow.service';

@Controller('walkflow/openapi')
export class WalkflowOpenApiController {
  constructor(private readonly walkflowService: WalkflowService) {}

  @Get('detail/:flowId')
  getWalkflowDetail(@Param('flowId') flowId: string) {
    return this.walkflowService.getWalkflowDetailByFlowId(flowId);
  }
}
