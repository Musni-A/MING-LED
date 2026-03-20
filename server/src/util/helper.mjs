import bcrypt from 'bcrypt';

const saltRount = 10;

export const hashPassword = (password)=>{
    const salt = bcrypt.genSaltSync(saltRount);
    console.log(salt)
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain, hashed)=>{
    return bcrypt.compareSync(plain, hashed)
}