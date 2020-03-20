//check to see if there is a user by the email enter
//and decrypt password

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
    //reject is err while resolve is it's done
    return new Promise(async (resolve, reject) => {
        try {
            //you can find by anything, i am using email
            const user = await User.findOne({email});

            //matching password
            //first parameter is the payload
            //second parameter is what would be in database
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    resolve(user);
                } else {
                    reject('Auth failed');
                }
            })
        } catch(err) {
            //email not found in collection
            reject('Auth failed');
        }
    })
}
