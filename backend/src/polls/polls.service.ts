import {PrismaService} from "../prisma/prisma.service";
import {Injectable, NotFoundException} from "@nestjs/common";
import {CreatePollDto} from "./dto/create-poll.dto";

@Injectable()
export class PollsService {
    constructor(private readonly prisma: PrismaService) {
    }

    async createPool(payload: CreatePollDto, userId: number) {
        try {
            const { question, options } = payload;
            return await this.prisma.$transaction(async (tx) => {
                return tx.poll.create({
                    data: {
                        question,
                        creatorId: userId,
                        options: { create: options.map(text => ({ text })) }
                    },
                    include: { options: true }
                })
            })
        } catch (error) {
            throw new Error('Error creating poll: ' + error.message);
        }
   }

    async getPollById(id: string) {
        const poll = await this.prisma.poll.findUnique({
            where: { id: parseInt(id) },
            include: { options: true }
        })
        if(!poll){
            throw new NotFoundException(`Poll with ID ${id} not found`)
        }
        return poll;
    }
}
