import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';
import { GroupTeam } from './entities/group-team.entity';
import { Group } from './entities/group.entity';
import { MatchDay } from './entities/match-day.entity';
import { Match } from './entities/match.entity';
import { Phase } from './entities/phase.entity';
import { TournamentRoster } from './entities/tournament-roster.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { Tournament } from './entities/tournament.entity';
import { FixtureController } from './fixture.controller';
import { FixtureService } from './fixture.service';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PhasesController } from './phases.controller';
import { PhasesService } from './phases.service';
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
      Phase,
      Group,
      GroupTeam,
      MatchDay,
      Match,
      Team,
      Player,
    ]),
    MediaModule,
  ],
  controllers: [
    TournamentsController,
    RegistrationsController,
    RostersController,
    PhasesController,
    GroupsController,
    FixtureController,
    MatchesController,
  ],
  providers: [
    TournamentsService,
    RegistrationsService,
    RostersService,
    PhasesService,
    GroupsService,
    FixtureService,
    MatchesService,
  ],
  exports: [TournamentsService, RegistrationsService, RostersService],
})
export class TournamentsModule {}
