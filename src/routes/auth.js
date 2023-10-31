const e = require("express")
const jwt = require("jsonwebtoken")
const express = require("express")
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require("../models/userData")
// app.use(express.json({ extended: false }));



router.get("/", (req, res) => {
   res.send(" hello, this is the home page ")
})

router.post("/register", async (req, res) => {

   const { firstname, lastname, email, phone, work, password, Cpassword } = req.body

   if (!firstname || !lastname || !email || !phone || !work || !password || !Cpassword) {
      return res.status(422).json({ error: "plz fill the fields properly" })
   }
   try {
      const userExist = await User.findOne({ email: email })
      if (userExist) {
         return res.status(409).json("email already exist")
      }
      if (password === Cpassword) {
         const user = new User({ firstname, lastname, email, phone, work, password, Cpassword })
         //here middleware is being used for hashing the passowrds  in auth.js i.e pre
         const result = await user.save()
         console.log(result)
         res.status(201).json({ message: "user registred succsessfully" })
      }
      else {
         res.status(401).json({ message: "password not matching" })

      }
   } catch (error) {
      console.log(error);
   }

})


router.post("/signin", async (req, res) => {

   try {
      const { email, password } = req.body

      if (!email || !password) {
         return res.status(400).json({ message: "plz filled properly" })
      }

      const userlogin = await User.findOne({ email: email })

      //  console.log(userlogin);

      if (userlogin) {
         const isMatch = await bcrypt.compare(password, userlogin.password)

         const token = await userlogin.generateAuthtoken()
         console.log(token)

         res.cookie("jwt", token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true
         })



         if (!isMatch) {
            res.status(400).json({ message: "invalid user login details" })
         } else {
            res.json({ message: "user login successfully" })
         }
      }
      else {
         res.status(400).json({ message: "invalid user login details" })

      }

   }
   catch (error) {
      console.log(error)
   }


})


router.get("/about", (req, res) => {
   res.send(" hello, this is the about page ")
})

router.get("/contact", (req, res) => {
   res.send(" hello, this is the contact page ")
})

// router.get("/signin", (req, res) => {
//    res.send(" hello, this is the Sign In page ")
// })

router.get("/signout", (req, res) => {
   res.send(" hello, this is the Sign out page ")
})

router.get("/", (req, res) => {
   res.send(" hello, this is the home page ")
})

module.exports = router