import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // @AfterInsert()
  // logInsert(): void {
  //   console.log('Inserted User with id', this.id);
  // }
  //
  // @AfterRemove()
  // logRemove(): void {
  //   console.log('Removed User with id', this.id);
  // }
  // @AfterUpdate()
  // logUpdate(): void {
  //   console.log('Updated User with id', this.id);
  // }
}
