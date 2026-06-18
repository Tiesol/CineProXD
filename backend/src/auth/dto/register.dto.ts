import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {}
