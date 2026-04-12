import { IsString, MinLength, MaxLength, IsEmail, IsOptional, IsNumber, IsDate } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    login: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsDate()
    birthDate?: Date;

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsNumber()
    avatarPicId?: number;
}