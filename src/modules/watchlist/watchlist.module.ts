import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WatchList } from './models/watchList.model';

@Module({
  imports: [SequelizeModule.forFeature([WatchList])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
