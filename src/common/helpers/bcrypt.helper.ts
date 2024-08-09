import * as bcrypt from 'bcrypt';

export class BcryptHelper {
    static generateHash(password: string) {
        const saltOrRounds = 11;
        const salt = bcrypt.genSaltSync(saltOrRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    }

    static compareHash(password: string, hashedPassword: string) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}
