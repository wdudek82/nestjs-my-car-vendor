import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed User with id', this.id);
  }
  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated User with id', this.id);
  }
}
