const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const saltRounds = await bcrypt.genSaltSync(10);
    //const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const passwordHash = await bcrypt.hashSync(body.password, saltRounds)

    // if (body.username.length < 3 || body.name.length < 3) {
    //     return response.status(400).json({error: "username or name are less than 3 characters"})
    // }

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

// usersRouter.get('/', async (request, response) => {
//   const users = await User.find({})
//   response.json(users.map(u => u.toJSON()))
// })

usersRouter.get('/', async (request, response) => {
  const user = await User
    .find({}).populate('blogs', {url: 1, title: 1, author: 1})

  response.json(user.map(u => u.toJSON()))
})

module.exports = usersRouter