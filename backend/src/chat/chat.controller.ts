import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post()
    chat(@Body() body: { question: string }) {
        return this.chatService.chat(body.question);
    }
}