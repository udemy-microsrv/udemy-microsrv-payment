import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  healthCheck(): string {
    return "I'm alive... (っ´ཀ`)っ";
  }
}
