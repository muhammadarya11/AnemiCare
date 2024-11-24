import bcrypt from 'bcrypt';

class Hash {
    static make(data) {
        return bcrypt.hashSync(data, 5);
    }

    static check(data, hash) {
        return bcrypt.compareSync(data, hash);
    }
}

export default Hash;