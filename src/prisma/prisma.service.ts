import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    
    console.log('\x1b[36m%s\x1b[0m', '┌───────────────────────────────────────────────────────────────────────────────────────-┐');
    console.log('\x1b[36m%s\x1b[0m', '│  ✅  PostgreSQL Connected                      │');
    console.log('\x1b[36m%s\x1b[0m', '│  📍  Host: ' + process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost');
    console.log('\x1b[36m%s\x1b[0m', '│  📚  Database: ' + process.env.DATABASE_URL?.split('/').pop()?.split('?')[0] || 'unknown');
    console.log('\x1b[36m%s\x1b[0m', '│  🟢  Status: Active                           │');
    console.log('\x1b[36m%s\x1b[0m', '└───────────────────────────────────────────────────────────────────────────────────────-┘');
    console.log('\x1b[32m%s\x1b[0m', '✨ Prisma Client ready');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    
    console.log('\x1b[33m%s\x1b[0m', '┌─────────────────────────────────────────────────┐');
    console.log('\x1b[33m%s\x1b[0m', '│  🔌  PostgreSQL Disconnected                  │');
    console.log('\x1b[33m%s\x1b[0m', '│  🟡  Status: Inactive                         │');
    console.log('\x1b[33m%s\x1b[0m', '│  👋  Goodbye!                                │');
    console.log('\x1b[33m%s\x1b[0m', '└─────────────────────────────────────────────────┘');
  }
}