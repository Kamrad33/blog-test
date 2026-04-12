import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('pictures')
export class Picture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    url: string;

    @Column({ name: 'post_id', nullable: true })
    postId: number;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @Column({ default: 0 })
    order: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Post, (post) => post.pictures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(() => User, (user) => user.pictures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}