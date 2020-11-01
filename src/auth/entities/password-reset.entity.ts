import { User } from "src/user/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('password_reset')
export class PasswordResetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({ name: 'password_recovery_pin', type: 'int'})
  passwordRecoveryPin: number;

  @Column({ type: 'bool', default: false, nullable: true })
  used: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

}