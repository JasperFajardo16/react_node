const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')


router.post('/register', async (req, res) => {

    //validate the data before we make a user
    const { error } = registerValidation(req.body)
    if(error)
    return res.status(400).send(error.details[0].message)

    //checking if the user exist in the DB
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('email already exists')

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //create a user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const saveUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err)
    }
});

//Login
router.post('/login', async (req, res) => {
        //validate the data before we make a user
        const { error } = loginValidation(req.body)
        if(error)
        return res.status(400).send(error.details[0].message);

        //checking if the email exist in the DB
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send('email is invalid');

        //password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('invalid password')

        res.send('logged in!')
})
 
module.exports = router;