const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({

    title: {  type: String,
              required: true,
              minlength: 5
          },
    author: String,
    url: {  type: String,
            required: true,
            minlength: 5
          },
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }

})

blogSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)