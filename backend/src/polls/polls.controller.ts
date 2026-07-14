import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {PollsService} from "./polls.service";
import {CreatePollDto} from "./dto/create-poll.dto";

@Controller('polls')
export class PollsController {
    constructor( private readonly pollsService: PollsService ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPoll(@Req() req: Request, @Body() payload: CreatePollDto) {
        try {
            const userId = (req as any).user.sub; // Assuming the user ID is stored in req.user.sub
            const poll = await this.pollsService.createPool(payload, userId);
            return poll;
        } catch (error) {
            throw new BadRequestException('can\'t create poll');
        }
    }

    @Get(':id')
    async getPollById(@Param('id') id: string) {
        try {
            return await this.pollsService.getPollById(id)
        } catch (error) {
            throw new NotFoundException('poll not found');
        }

    }
}
