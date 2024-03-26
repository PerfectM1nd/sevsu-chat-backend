import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  lastOnlineTime: Date;

  @Column({ nullable: true })
  gender: boolean;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  phoneNumber: string;
}
