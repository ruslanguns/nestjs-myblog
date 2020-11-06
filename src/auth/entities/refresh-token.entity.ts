import { AfterInsert, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { uid } from 'rand-token';
import { User } from "src/user/entities";
import ms = require('ms');
import * as moment from 'moment';


@Entity('refresh-tokens')
export class RefreshTokenEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user!: User;

  @Column({ name: 'refresh_token', nullable: true, default: '' })
  refreshToken: string;

  @CreateDateColumn({ name: 'issued_time', type: 'timestamp'})
  issuedTime: Date;

  @Column({ name: 'expiration_time', type: 'timestamp' })
  expirationTime: Date;
    
  @BeforeInsert()
  setExpirationTime() {
    const tokenExpiration = ms('1y');
    this.expirationTime = moment(this.issuedTime).add(tokenExpiration, "milliseconds").toDate();
  }

  @BeforeInsert()
  async generateTicket() {
    this.refreshToken = uid(100);
  }

  @AfterInsert()
  async logId() {
    this.refreshToken = this.refreshToken + '_' + this.id;
  }

  newRefreshToken?: string;
}