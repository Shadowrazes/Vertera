import bcrypt from 'bcrypt';

class Account {
    static async GenerateHash(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            return passwordHash;
        }
        catch (err) {
            console.log(err);
            throw new Error('Registration error');
        }
    }

    static async CheckPassword(password, passwordHash) {
        try {
            const isValidPassword = await bcrypt.compare(password, passwordHash);
            return isValidPassword;
        }
        catch (err) {
            console.log(err);
            throw new Error('Auth error');
        }
    }
}

export default Account;