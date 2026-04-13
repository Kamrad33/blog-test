import { IsString, MinLength, MaxLength, IsEmail, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    login: string;

    // TODO регулярка на сложность
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
    @IsDateString()
    birthDate?: Date;

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsNumber()
    avatarPicId?: number;
}