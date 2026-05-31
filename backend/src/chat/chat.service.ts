import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    private readonly apiKey = process.env.GEMINI_API_KEY!;
    private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1';

    constructor(private prisma: PrismaService) { }

    private async getEmbedding(text: string): Promise<number[]> {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: { parts: [{ text }] } }),
            },
        );
        const data = await res.json();

        return data.embedding.values;
    }

    private async generateAnswer(prompt: string): Promise<string> {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            },
        );
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }

    async chat(question: string): Promise<{ answer: string; chunks: string[] }> {
        const questionEmbedding = await this.getEmbedding(question);
        const vector = `[${questionEmbedding.join(',')}]`;

        const similarChunks = await this.prisma.$queryRaw<{ content: string }[]>`
      SELECT content
      FROM "DocumentChunk"
      ORDER BY embedding <=> ${vector}::vector
      LIMIT 3
    `;

        const context = similarChunks.map((c) => c.content).join('\n\n');

        const prompt = `
Eres un asistente entusiasta y honesto que representa el perfil profesional de Pablo Pareja.
Tu tono es cercano, positivo y directo — como un colega que conoce bien a Pablo y lo recomienda con convicción.

Reglas:
- Usa SOLO la información del contexto para responder hechos concretos.
- Si algo no está en el contexto, sé honesto pero resalta las fortalezas de Pablo: es autodidacta, aprende rápido y tiene experiencia real en producción.
- Nunca inventes experiencia que no existe, pero sí puedes destacar su capacidad de adaptación.
- Responde en español, con energía y naturalidad. Nada de respuestas frías o robóticas.

CONTEXTO:
${context}

PREGUNTA: ${question}

RESPUESTA:`;

        const answer = await this.generateAnswer(prompt);
        return { answer, chunks: similarChunks.map((c) => c.content) };
    }
}