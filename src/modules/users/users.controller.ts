import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { HandleException } from 'src/common/decorators/handle-exceptio-decorator.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';

import { AuthUser } from '../auth/auth.decorator';
import { AuthUserDto } from '../auth/dtos/auth-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { DeactivateUserDto } from './dtos/deactivate-user.dto';
import { FindUserQuery } from './dtos/find-user-query.dto';
import { SigninDto } from './dtos/signin.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findUsers(@Query() findUserQuery: FindUserQuery) {
        return this.usersService.findMany(findUserQuery);
    }

    
    @Get('/verify-token')
    @ApiBearerAuth()
    @HandleException('ERROR VERIFY TOKEN')
    verifyToken(@AuthUser() user: AuthUserDto) {
        return this.usersService.verifyToken(user);
    }


    @Get('/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @UseGuards(AdminGuard)
    @HandleException('ERROR FIND USER FROM ADMIN')
    async findUser(@Param('id') id: Types.ObjectId) {
        return this.usersService.findOneById(id);
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
    @ApiBearerAuth()
    @HandleException('ERROR SIGNOUT USER')
    async signout(@AuthUser() user: AuthUserDto) {
        return this.usersService.signout(user._id);
    }

    @Post('/deactivate-user')
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @HandleException('ERROR DESACTIVATE USER')
    async deactivateUser(@Body() deactivateUserDto: DeactivateUserDto) {
        return this.usersService.deactivateUser(deactivateUserDto);
    }
}
