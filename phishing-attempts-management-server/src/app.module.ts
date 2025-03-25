import { Module } from '@nestjs/common';
import { AuthModule } from './controllers/auth/auth.module';
import { SimulationsModule } from './controllers/simulations/simulations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule, 
    SimulationsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
})
export class AppModule {}
