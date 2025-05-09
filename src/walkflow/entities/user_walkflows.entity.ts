import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FlowStatus {
  DRAFT = 'draft', // 草稿
  PUBLISHED = 'published', // 已发布
  EDITED = 'edited', // 已编辑
}

interface ChapterStep {
  uid: string;
  type: 'chapter';
  name?: string;
  title?: string;
  subtitle?: string;
  align: 'left' | 'center' | 'right';
  actions: {
    type: 'button';
    text: string;
    destination: string;
  }[];
}

interface HotSpotStep {
  uid: string;
  type: 'hotspot';
  name?: string;
  title?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  align: 'left' | 'center' | 'right';
  screenshotUrl: string;
  destination: string;
}

export interface FlowSchemaV1 {
  schema: '1.0';
  config: {
    screenRecordingUrl: string;
    steps: Array<ChapterStep | HotSpotStep>;
  };
}

@Entity({
  name: 'walkflow_user_flows',
})
export class UserWalkflows {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: string;

  @Column({ comment: '流程ID' })
  flowId: string;

  @Column({ comment: '流程名称' })
  flowName: string;

  @Column({
    type: 'enum',
    enum: FlowStatus,
    comment: '流程状态',
    default: FlowStatus.DRAFT,
  })
  flowStatus: FlowStatus;

  @Column({
    comment: '缩略图',
    default: null,
  })
  thumbnail: string;

  @Column({
    type: 'json',
    comment: '发布版本的schema json',
  })
  schemaJson: FlowSchemaV1;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
