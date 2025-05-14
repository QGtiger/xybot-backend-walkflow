import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalkflowService } from './walkflow.service';
import { RequireLogin, UserInfo } from '../common/custom.decorator';
import { LoginGuard } from '../common/login.guard';
import { CreateUserWalkflowDto } from './dto/create-walkflow.dto';
import { DelUserWalkflowDto } from './dto/del-walkflow.dto';
import { UpdateWalkflowDto } from './dto/update-walkflow.dto';

@RequireLogin()
@UseGuards(LoginGuard)
@Controller('walkflow')
export class WalkflowController {
  constructor(private readonly walkflowService: WalkflowService) {}

  @Post('create')
  async createWalkflow(
    @Body() body: CreateUserWalkflowDto,
    @UserInfo('id') userId: string,
  ) {
    return this.walkflowService.createWalkflow(body, userId);
  }

  @Post('delete')
  async deleteWalkflow(
    @Body() body: DelUserWalkflowDto,
    @UserInfo('id') userId: string,
  ) {
    return this.walkflowService.deleteWalkflow(body, userId);
  }

  @Post('update')
  updateWalkflow(
    @Body() body: UpdateWalkflowDto,
    @UserInfo('id') userId: string,
  ) {
    return this.walkflowService.updateWalkflow(body, userId);
  }

  @Get('list')
  getWalkflowList(@UserInfo('id') userId: string) {
    return this.walkflowService.getWalkflowList(userId);
  }

  @Get('detail/:flowId')
  getWalkflowDetail(
    @Param('flowId') flowId: string,
    @UserInfo('id') userId: string,
  ) {
    return this.walkflowService.getWalkflowDetail({
      flowId,
      userId,
    });
  }
}
