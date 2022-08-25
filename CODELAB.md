# INSTALLATION

```bash
nest new {project-name}
npm run start:dev

npm i --save @nestjs/config

npm i --save @nestjs/typeorm typeorm sqlite
npm i --save sqlite3 
```

```ts
import { ConfigModule } from '@nestjs/config';

TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
    return {          
        type: 'sqlite',
        database: configService.get('SQL_MEMORY_DB_SHARED'),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true
    } as TypeOrmModuleOptions;
    },
}),
```

```bash
nest g resource planet
````