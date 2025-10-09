import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateTenantDTO {
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    lastname: string;

    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    firstname: string;
    
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
}