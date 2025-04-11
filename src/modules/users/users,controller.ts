import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AuthUser } from '../auth/auth.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { UsersService } from './users.service';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { FindUserQuery } from './dtos/find-user-query.dto';
import { DeactivateUserDto } from './dtos/deactivate-user.dto';
import { HandleException } from 'src/common/decorators/handle-exceptio-decorator.decorator';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/find')
    @UseGuards(AdminGuard)
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findUser(@Query() findUserQuery: FindUserQuery) {
        return this.usersService.findOne(findUserQuery);
    }

    @Get('/find-many')
    @UseGuards(AdminGuard)
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findManyUsers(@Query() findUserQuery: FindUserQuery) {
        return this.usersService.findMany(findUserQuery);
    }

    @Post('/sign-up')
    @HandleException('ERROR CREATE USER')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Post('/sign-in')
    @HandleException('ERROR SIGNIN USER')
    async signin(@Body() signinDto: SigninDto) {
        return this.usersService.signin(signinDto);
    }

    @Post('/sign-out')
    @HandleException('ERROR SIGNOUT USER')
    async signout(@AuthUser() user: AuthUserDto) {
        return this.usersService.signout(user._id);
    }

    @Get('/verify-token')
    @HandleException('ERROR VERIFY TOKEN')
    async verifyToken(@AuthUser() user: AuthUserDto) {
        return await this.usersService.verifyToken(user);
    }

    @Post('/deactivate-user')
    @UseGuards(AdminGuard)
    @HandleException('ERROR DESACTIVATE USER')
    async deactivateUser(@Body() deactivateUserDto: DeactivateUserDto) {
        return this.usersService.deactivateUser(deactivateUserDto);
    }
}
