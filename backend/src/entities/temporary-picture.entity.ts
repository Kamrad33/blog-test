import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('temporary_pictures')
@Index(['userId', 'createdAt'])
export class TemporaryPicture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    url: string;

    @Column({ name: 'user_id' })
    userId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ default: false })
    isUsed: boolean;
}