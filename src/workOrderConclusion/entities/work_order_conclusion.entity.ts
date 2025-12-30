import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'work_order_conclusion',
})
export class WorkOrderConclusion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '会话ID' })
  sessionId: string;

  @Column({ comment: '用户ID' })
  userId: string;

  @Column({ comment: 'AI content' })
  aiContent: string;

  @Column({ comment: 'Final content' })
  finalContent: string;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
