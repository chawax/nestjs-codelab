import { NestFactory } from '@nestjs/core';
import { AutoUpgrader } from 'sqlite3orm/AutoUpgrader';
import { SqlDatabase } from 'sqlite3orm/core/SqlDatabase';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  
  const sqlDatabase = new SqlDatabase();
  await sqlDatabase.open(process.env.SQL_MEMORY_DB_SHARED);
  const autoUpgrader = new AutoUpgrader(sqlDatabase);

  // run autoupgrade for all registered tables
  autoUpgrader.upgradeAllTables();
}

bootstrap();
