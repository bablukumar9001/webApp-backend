const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Cpassword: {
        type: String,
        required: true

    },
    tokens: [{
        token: {
            type: String,
            required: true

        }
    }],
    date: {
        type: Date,
        default: Date.now
    }

})

// hashng the passwords

UserSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
        this.Cpassword = await bcrypt.hash(this.Cpassword, 12)

        console.log(this.password)
        console.log(this.Cpassword)

    }
    next()
})


UserSchema.methods.generateAuthtoken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECURITY_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token


    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model("User", UserSchema)


module.exports = User