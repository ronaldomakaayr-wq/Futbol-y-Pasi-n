import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';
import { TournamentRoster } from './entities/tournament-roster.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { Tournament } from './entities/tournament.entity';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { RostersController } from './rosters.controller';
import { RostersService } from './rosters.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      TournamentTeam,
      TournamentRoster,
      Team,
      Player,
    ]),
    MediaModule,
  ],
  controllers: [
    TournamentsController,
    RegistrationsController,
    RostersController,
  ],
  providers: [TournamentsService, RegistrationsService, RostersService],
  exports: [TournamentsService, RegistrationsService, RostersService],
})
export class TournamentsModule {}
