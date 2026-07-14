import {ArrayMinSize, IsArray, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePollDto {
    @ApiProperty({
        description: 'The question for the poll',
        example: 'What is your favorite programming language?',
        required: true
    })
    @IsString()
    @MinLength(5)
    question: string;

    @ApiProperty({
        description: 'The options for the poll',
        example: ['JavaScript', 'Python', 'Java', 'C++'],
        required: true
    })
    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    @MinLength(2, { each: true })
    options: string[]
}
