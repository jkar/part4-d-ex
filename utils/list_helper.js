const dummy = (blogs) => {
    
    return 1
  }

  const totalLikes = (blogsList) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogsList.reduce(reducer, 0)
  }

  const favoriteBlog = (blogsList) => {

    // const maxCallback = (max, current) => {
    //     return blogsList.reduce((max, current) => current.likes > max ? current.likes : max, blogsList[0].likes)
    // }
    //console.log('it iss', blogsList.reduce(maxCallback))
    //return blogsList.reduce(maxCallback)
    
    return blogsList.reduce((max, current) => current.likes > max ? current.likes : max, blogsList[0].likes)
  }

  const mostBlogs = (blogsList) => {

    let resultList = []
    blogsList.forEach(blog => {
      if (resultList.findIndex((element) => element.author === blog.author) === -1 ) {
        const b = {
          author: blog.author,
          blog: 1
        }
        resultList.push(b)
      } else {
        const index = resultList.findIndex((element) => element.author === blog.author)
        resultList[index].blog += 1
      }
    })

    const maxBlogs = resultList.reduce((max, current) => current.blog > max ? current.blog : max, resultList[0].blog)
    const indexWithMostBlogs = resultList.findIndex((element) => element.blog === maxBlogs)
    const authorWithMostBlogs = {
      author: resultList[indexWithMostBlogs].author,
      blog: resultList[indexWithMostBlogs].blog
    }
    console.log(authorWithMostBlogs)
    return authorWithMostBlogs
  }

  const mostLikes = blogsList => {
    const mostL = blogsList.reduce((max, current) => current.likes > max ? current.likes : max, blogsList[0].likes)
    const index = blogsList.findIndex((element) => element.likes === mostL )
    const author = {
      author: blogsList[index].author,
      likes: blogsList[index].likes
    }
    console.log(author)
    return author
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }