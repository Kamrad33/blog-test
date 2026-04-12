import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsBoolean()
    isShown?: boolean;

    @IsOptional()
    @IsString()
    content?: string;
}