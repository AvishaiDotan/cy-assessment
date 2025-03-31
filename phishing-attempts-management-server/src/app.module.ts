import { Module } from '@nestjs/common';
import { AuthModule } from './controllers/auth/auth.module';
import { SimulationsModule } from './controllers/simulations/simulations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DbModule } from './services/db/db.module';

@Module({
  imports: [
    AuthModule, 
    SimulationsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'dist', '..', 'public'),
    }),
    DbModule,
  ],
})
export class AppModule {}
