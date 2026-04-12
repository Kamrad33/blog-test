export class CreateUserDto {
    login: string;
    passwordHash: string;
    email: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    about?: string;
    avatarPicId?: number;
}