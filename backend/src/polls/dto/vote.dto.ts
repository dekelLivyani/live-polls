import {ArrayMinSize, IsArray, IsInt, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class VoteDto {
    @ApiProperty({
        description: 'The ID of the option to vote on',
        example: 1,
        required: true
    })
    @IsInt()
    optionId: number;

    @ApiProperty({
        description: 'The voter ID for the poll',
        example: 'user123',
        required: true
    })
    @IsString()
    voterId: string
}
