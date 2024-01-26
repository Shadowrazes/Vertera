import JWT from 'jsonwebtoken';
import Errors from './Errors.js';

class Token {
    static Secret = 'f7496d8eb4536a8fb2ed68ad6bce4eaf';

    static async Generate(data) {
        const token = JWT.sign(
            {
                id: data.userId,
            },
            this.Secret,
            {
                expiresIn: '48h',
            },
        );
        return token;
    }

    static async Validation(token) {
        try {
            const decodedToken = JWT.verify(token, this.Secret);
            return decodedToken.id;
        }
        catch (err) {
            console.log(err);
            throw new Error(Errors.InvalidToken);
        }
    }
}

export default Token;