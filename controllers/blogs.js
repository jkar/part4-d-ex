const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require("../models/user")
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// blogsRouter.get('/', (request, response) => {
//   Blog.find({}).then(notes => {
//     response.json(notes.map(note => note.toJSON()))
//   })
// })
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1, id: 1})

  response.json(blogs.map(u => u.toJSON()))
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    //const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!token || !decodedToken.id) {
    //  if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id

  })

  if (typeof blog.likes === 'undefined') {
    blog.likes = 0
  }

  // blog.save()
  //   .then(savedNote => {
  //     response.json(savedNote.toJSON())
  //   })
  //   .catch(error => next(error))

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  // Blog.findByIdAndRemove(request.params.id)
  //   .then(() => {
  //     response.status(204).end()
  //   })
  //   .catch(error => next(error))

  const token = getTokenFrom(request)

  try {

    const decodedToken = jwt.verify(token, config.SECRET)
    //const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!token || !decodedToken.id) {
    //  if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === user._id.toString() ) {
        // Blog.findByIdAndRemove(request.params.id)
        //   .then(() => {
        //     response.status(204).end()
        //   })
        //   .catch(error => next(error))

      const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()

    } else {
      return response.status(401).json({ error: 'this blog cannot deleted by this user' })
    }


  } catch(exception) {
    next(exception)
  }


})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  let blogToUpdate = {};

  blogToUpdate = Object.assign(blogToUpdate, blog._doc);
  delete blogToUpdate._id;

  Blog.findByIdAndUpdate(request.params.id, blogToUpdate, {new: true})

    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))

})

module.exports = blogsRouter