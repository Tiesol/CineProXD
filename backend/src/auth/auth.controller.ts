import { Controller, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@CurrentUser() user: User) {
        return this.authService.login(user);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
