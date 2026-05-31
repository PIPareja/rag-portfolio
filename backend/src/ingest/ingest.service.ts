import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngestService {
    private readonly apiKey = process.env.GEMINI_API_KEY!;

    constructor(private prisma: PrismaService) { }

    private chunkText(text: string, chunkSize = 500): string[] {
        const chunks: string[] = [];
        const sentences = text.split(/(?<=[.!?])\s+/);
        let current = '';

        for (const sentence of sentences) {
            if ((current + sentence).length > chunkSize && current.length > 0) {
                chunks.push(current.trim());
                current = sentence;
            } else {
                current += ' ' + sentence;
            }
        }

        if (current.trim()) chunks.push(current.trim());
        return chunks;
    }

    private async getEmbedding(text: string): Promise<number[]> {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-embedding-001:embedContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: { parts: [{ text }] } }),
            },
        );
        const data = await res.json();
        return data.embedding.values;
    }

    async ingestDocument(text: string): Promise<{ chunksCreated: number }> {
        await this.prisma.$executeRaw`DELETE FROM "DocumentChunk"`;

        const chunks = this.chunkText(text);

        for (const chunk of chunks) {
            const embedding = await this.getEmbedding(chunk);
            const vector = `[${embedding.join(',')}]`;

            await this.prisma.$executeRaw`
        INSERT INTO "DocumentChunk" (content, embedding, "createdAt")
        VALUES (${chunk}, ${vector}::vector, NOW())
      `;
        }

        return { chunksCreated: chunks.length };
    }
}