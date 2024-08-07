import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchListDTO } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { CreateAssetResponse, GetUserAssetsResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatchList } from './models/watchList.model';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchListService: WatchlistService) {}

  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateAssetResponse })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createAsset(
    @Body() assetDto: WatchListDTO,
    @Req() request,
  ): Promise<CreateAssetResponse> {
    const user = request.user;
    return this.watchListService.createAsset(user, assetDto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: GetUserAssetsResponse })
  @UseGuards(JwtAuthGuard)
  @Get('get-elements')
  getUserAssets(@Req() request): Promise<WatchList[]> {
    const user = request.user;
    return this.watchListService.getUserAssets(user.id);
  }

  /*   @Get('get-all')
  getAllAssets() {
    return;
  }

  @Patch('update')
  updateAsset() {
    return;
  } */

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAsset(
    @Query('id') assetId: string,
    @Req() request,
  ): Promise<boolean> {
    const { id } = request.user;
    await this.watchListService.deleteAsset(id, assetId);
    return true;
  }
}
