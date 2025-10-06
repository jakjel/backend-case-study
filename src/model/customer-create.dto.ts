import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsDate, IsNotEmpty, Length } from 'class-validator';
import { Subscription } from './subscription';

export class CreateCustomerDTO {
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    username: string;

    @ApiProperty({required: true})
    @IsEmail()
    @IsNotEmpty()
    @Length(1, 50)
    email: string;

    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    password: string;

    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    avatar: string;

    @ApiProperty({required: true})
    @Type(() => Date) 
    @IsDate()
    @IsNotEmpty()
    birthday: Date;

    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    firstName: string;
    
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    lastName: string;

    @ApiProperty({required: true})
    subscription: Subscription;
}