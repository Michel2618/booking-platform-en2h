import 'dotenv/config'; // <-- Forces the .env file to load!
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Grab the Neon database URL
    const connectionString = process.env.DATABASE_URL;
    
    // 2. Build the secure connection pool
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    // 3. Satisfy Prisma's strict requirement by passing the adapter
    super({ adapter }); 
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}