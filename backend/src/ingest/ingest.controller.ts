import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
    constructor(private readonly ingestService: IngestService) { }

    @Post()
    ingest(@Body() body: { text: string }) {
        return this.ingestService.ingestDocument(body.text);
    }
}