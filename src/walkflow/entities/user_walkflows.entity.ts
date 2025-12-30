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

  @Column({
    type: 'json',
  })
  flowPostSchema: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
