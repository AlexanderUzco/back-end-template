import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthUser } from '../auth/auth.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { UsersService } from './users.service';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { FindOneByParamsDto } from './dtos/find-one-by-params.dto';
import { FindByEmailDto } from './dtos/find-by-email.dto';
import { DesactivateUserDto } from './dtos/desactivate-user.dto';
import { HandleException } from 'src/decorators/handle-exceptio-decorator.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // add HandleException decorator

    @Post('/signup')
    @HandleException('ERROR CREATE USER')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Post('/signin')
    @HandleException('ERROR SIGNIN USER')
    async signin(@Body() signinDto: SigninDto) {
        return this.usersService.signin(signinDto);
    }

    @Get('/signout')
    @HandleException('ERROR SIGNOUT USER')
    async signout(@AuthUser() user: AuthUserDto) {
        return this.usersService.signout(user._id);
    }

    @Get('/verify-token')
    @HandleException('ERROR VERIFY TOKEN')
    async verifyToken(@AuthUser() user: AuthUserDto) {
        return await this.usersService.verifyToken(user);
    }

    @Get('/find-from-admin/:id')
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findByUserIdFromAdmin(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    @Post('/find-by-params')
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findUserByManyParams(@Body() findOneByParamsDto: FindOneByParamsDto) {
        return this.usersService.findOneByParams(findOneByParamsDto);
    }

    @Post('find-by-email')
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findByEmail(@Body() findByEmailDto: FindByEmailDto) {
        return this.usersService.findOneByEmail(findByEmailDto.email);
    }

    @Post('/desactivate-user')
    @HandleException('ERROR DESACTIVATE USER')
    async desactivateUser(@Body() desactivateUserDto: DesactivateUserDto) {
        return this.usersService.desactivateUser(desactivateUserDto);
    }
}
