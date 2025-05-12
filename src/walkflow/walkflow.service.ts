import { Injectable } from '@nestjs/common';
import { CreateUserWalkflowDto } from './dto/create-walkflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FlowSchemaV1, UserWalkflows } from './entities/user_walkflows.entity';
import { Repository } from 'typeorm';
import { generateUuid } from 'src/utils';
import { DelUserWalkflowDto } from './dto/del-walkflow.dto';
import { UpdateWalkflowDto } from './dto/update-walkflow.dto';

@Injectable()
export class WalkflowService {
  @InjectRepository(UserWalkflows)
  private readonly userWalkflowsRepository: Repository<UserWalkflows>;

  private convertExtensionSchemaToWalkflowSchema(
    schema: ExtensionSchemaV1,
  ): FlowSchemaV1 {
    const { clicks, screenRecordingUrl } = schema;

    const steps = clicks.reduce(
      (acc, click) => {
        const { x, y, w, h, t, innerText, screenshotUrl } = click;
        const step: FlowSchemaV1['config']['steps'][number] = {
          uid: generateUuid(),
          type: 'hotspot',
          title: innerText,
          x,
          y,
          w,
          h,
          t,
          align: 'left',
          screenshotUrl,
          destination: 'next',
        };
        acc.push(step);
        return acc;
      },
      [
        {
          uid: generateUuid(),
          type: 'chapter',
          title: '主标题',
          subtitle: '副标题',
          align: 'left',
          actions: [
            {
              type: 'button',
              text: '开始引导',
              destination: 'next',
            },
          ],
        },
      ] as FlowSchemaV1['config']['steps'],
    );

    return {
      version: '1.0',
      config: {
        screenRecordingUrl: screenRecordingUrl,
        steps,
      },
    };
  }

  async createWalkflow(body: CreateUserWalkflowDto, userId: string) {
    console.log('Creating walkflow with body:', body);

    const uuid = generateUuid();
    const walkflow = new UserWalkflows();
    walkflow.userId = userId;
    walkflow.flowId = uuid;
    walkflow.flowName = `walkflow_${uuid}`;
    walkflow.thumbnail = body.schema.clicks.at(0)?.screenshotUrl || '';
    walkflow.schemaJson = this.convertExtensionSchemaToWalkflowSchema(
      body.schema,
    );

    return this.userWalkflowsRepository.save(walkflow);
  }

  private async queryWalkflow(data: { flowId: string; userId: string }) {
    const walkflow = await this.userWalkflowsRepository.findOne({
      where: data,
    });
    if (!walkflow) {
      throw new Error('Walkflow not found');
    }
    return walkflow;
  }

  async deleteWalkflow(data: DelUserWalkflowDto, userId: string) {
    console.log('Deleting walkflow with data:', data);

    // 先判断是否存在
    await this.queryWalkflow({
      userId,
      flowId: data.flowId,
    });

    await this.userWalkflowsRepository.delete({
      userId,
      flowId: data.flowId,
    });
  }

  async updateWalkflow(data: UpdateWalkflowDto, userId: string) {
    console.log('Updating walkflow with data:', data);

    // 先判断是否存在
    const walkflow = await this.queryWalkflow({
      userId,
      flowId: data.flowId,
    });

    Object.assign(walkflow, {
      flowName: data.name || walkflow.flowName,
    });

    // 更新数据
    await this.userWalkflowsRepository.save(walkflow);
  }

  async getWalkflowList(userId: string) {
    console.log('Getting walkflow list for user:', userId);

    const walkflows = await this.userWalkflowsRepository.find({
      where: { userId },
    });

    return walkflows.map((walkflow) => ({
      flowId: walkflow.flowId,
      flowName: walkflow.flowName,
      thumbnail: walkflow.thumbnail,
      createdAt: walkflow.createdAt.getTime(),
      updatedAt: walkflow.updatedAt.getTime(),
      flowStatus: walkflow.flowStatus,
    }));
  }

  async getWalkflowDetail(data: { flowId: string; userId: string }) {
    const walkflow = await this.queryWalkflow(data);

    return {
      flowId: walkflow.flowId,
      flowName: walkflow.flowName,
      thumbnail: walkflow.thumbnail,
      createdAt: walkflow.createdAt.getTime(),
      updateAt: walkflow.updatedAt.getTime(),
      flowStatus: walkflow.flowStatus,
      schema: walkflow.schemaJson,
    };
  }
}
