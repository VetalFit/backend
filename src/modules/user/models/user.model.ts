import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { WatchList } from 'src/modules/watchlist/models/watchList.model';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  userName: string;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => WatchList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  watchList: WatchList[];
}
