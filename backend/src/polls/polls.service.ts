import {PrismaService} from "../prisma/prisma.service";
import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {CreatePollDto} from "./dto/create-poll.dto";
import {RedisService} from "../redis/redis.service";
import {VoteDto} from "./dto/vote.dto";

@Injectable()
export class PollsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
    }

    async createPool(payload: CreatePollDto, userId: number) {
        try {
            const { question, options } = payload;
            const poll =  await this.prisma.$transaction(async (tx) => {
                return tx.poll.create({
                    data: {
                        question,
                        creatorId: userId,
                        options: { create: options.map(text => ({ text })) }
                    },
                    include: { options: true }
                })
            })
            poll.options.forEach((option) => {
                this.redis.set(`poll:${poll.id}:option:${option.id}:votes`, 0)
            })
            return poll;
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

    async voteOnPoll(pollId: string, payload: VoteDto) {
        const { optionId, voterId } = payload;
        const poll = await this.prisma.poll.findUnique({
            where: { id: parseInt(pollId) },
            include: { options: true }
        })
        if (!poll) {
            throw new NotFoundException(`Poll ${pollId} not found`)
        }
        const isOptionValid = poll.options?.some(option => option?.id === optionId);
        if(!isOptionValid){
            throw new NotFoundException(`Option with ID ${optionId} not found in poll ${pollId}`)
        }
        const saddCount = await this.redis.sadd(`poll:${pollId}:voters`, voterId);
        if(saddCount === 0){
            throw new ConflictException('User has already voted in this poll');
        } else {
            const votesKey = `poll:${pollId}:option:${optionId}:votes`;
            const newVoteCount = await this.redis.incr(votesKey);
            return { optionId, newVoteCount };
        }
    }
}
