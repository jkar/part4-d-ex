const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


test('blog list application returns the correct amount of blog posts in the JSON format', async () => {

    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(2)
})

test('unique identifier property of the blog posts is named id', async () => {

    const response = await api.get('/api/blogs')
    const firstBlock = await response.body[0]

    expect(firstBlock.id).toBeDefined()

})

test('check that making an HTTP POST request to the /api/blogs url successfully creates a new blog post', async () => {
    // const blog = new Blog({
    // title: "just a blog",
    // author: "yiannis",
    // url: "isbn989",
    // likes: 5
    // })

    const blog = {
        title: "just a blog",
        author: "yiannis",
        url: "isbn989",
        likes: 5
        }

    const startingDB = await api.get('/api/blogs')
    const startingLength = await startingDB.body.length

    //await blog.save('/api/blogs')
    await api.post('/api/blogs').send(blog)

    const lastingDB = await api.get('/api/blogs')
    const lastingLength = await lastingDB.body.length

    expect(lastingLength).toBe(startingLength+1)

    // delete lastingDB.body[lastingLength-1].id
    // expect(lastingDB.body).toContainEqual(blog)
 
    //OR
    const titles = lastingDB.body.map(el => el.title)
    expect(titles).toContain('just a blog')


})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const blog = {
        title: "just a blog",
        author: "yiannis",
        url: "isbn989"
        }

        await api.post('/api/blogs').send(blog)

        const blogs = await api.get('/api/blogs')
        lastBlog = await blogs.body[blogs.body.length-1]
        //console.log(blogs.body[blogs.body.length-1])

        expect(lastBlog.likes).toBe(0)
})


test(' if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const blog = {
        author: 'peter',
        likes:6
    }

    await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)


})

test('deletion of a single blog', async () => {

    const response = await api.get('/api/blogs')
    const startingBlogs = await response.body
    const blogToDelete = startingBlogs[startingBlogs.length-1]

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
    //console.log(blogToDelete.id)

    const response2 = await api.get('/api/blogs')
    const lastingBlogs = await response2.body

    expect(lastingBlogs.length).toBe(startingBlogs.length-1)

})

test('update the amount of likes for a blog post', async () => {
   
    let response = await api.get('/api/blogs')
    response = await response.body
    //response = await response.body.map(blog => blog.toJSON())
    const blogToUpdate = await response[response.length-1]
    const idOfBlog = blogToUpdate.id

        const blog = new Blog({
        title: "just a blog2",
        author: "yiannis",
        url: "isbn989",
        likes: 4
        })


    await api
        .put(`/api/blogs/${idOfBlog}`)
        .send(blog)
        .expect(200)

})

afterAll(() => {
    mongoose.connection.close()
  })