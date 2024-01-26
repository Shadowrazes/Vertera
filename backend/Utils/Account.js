import bcrypt from 'bcrypt';
import Errors from './Errors.js';

class Account {
    static async GeneratePassHash(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            return passwordHash;
        }
        catch (err) {
            console.log(err);
            throw new Error(Errors.RegistrationFailed);
        }
    }

    static async CheckPassword(password, passwordHash) {
        try {
            const isValidPassword = await bcrypt.compare(password, passwordHash);
            return isValidPassword;
        }
        catch (err) {
            console.log(err);
            throw new Error(Errors.PassValidationFailed);
        }
    }
}

export default Account;