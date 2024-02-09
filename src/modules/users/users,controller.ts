import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { UsersService } from './users.service';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { FindOneByParamsDto } from './dtos/find-one-by-params.dto';
import { FindByEmailDto } from './dtos/find-by-email.dto';
import { DesactivateUserDto } from './dtos/desactivate-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        try {
            return this.usersService.createUser(createUserDto);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error || 'ERROR CREATE USER',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Post('/signin')
    async signin(@Body() signinDto: SigninDto) {
        try {
            return this.usersService.signin(signinDto);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error || 'ERROR SIGNIN USER',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Get('/signout')
    async signout(@AuthUser() user: AuthUserDto) {
        try {
            return this.usersService.signout(user._id);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error || 'ERROR SIGNOUT USER',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Get('/verify-token')
    async verifyToken(@AuthUser() user: AuthUserDto) {
        try {
            return await this.usersService.verifyToken(user);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error.message || 'ERROR VERIFY TOKEN',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Get('/find-from-admin/:id')
    async findByUserIdFromAdmin(@Param('id') id: string) {
        try {
            return this.usersService.findOneById(id);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error || 'ERROR FIND USER FROM ADMIN',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Post('/find-by-params')
    async findUserByManyParams(@Body() findOneByParamsDto: FindOneByParamsDto) {
        try {
            return this.usersService.findOneByParams(findOneByParamsDto);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error || 'ERROR FIND USER FROM ADMIN',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Post('find-by-email')
    async findByEmail(@Body() findByEmailDto: FindByEmailDto) {
        return this.usersService.findOneByEmail(findByEmailDto.email);
    }

    @Post('/desactivate-user')
    async desactivateUser(@Body() desactivateUserDto: DesactivateUserDto) {
        try {
            return this.usersService.desactivateUser(desactivateUserDto);
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error || 'ERROR DESACTIVATE USER',
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }
}
