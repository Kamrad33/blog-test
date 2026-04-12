import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { Picture } from './picture.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 100 })
    login: string;

    @Column({ name: 'password_hash', length: 255 })
    @Exclude()
    passwordHash: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'phone_number', nullable: true, length: 64 })
    phoneNumber: string;

    @Column({ name: 'first_name', nullable: true, length: 255 })
    firstName: string;

    @Column({ name: 'last_name', nullable: true, length: 255 })
    lastName: string;

    @Column({ name: 'birth_date', nullable: true, type: 'date', })
    birthDate: Date;

    @Column({ type: 'text', nullable: true, })
    about: string;

    @Column({ name: 'avatar_pic_id', nullable: true, })
    avatarPicId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Picture, (picture) => picture.user)
    pictures: Picture[];
}