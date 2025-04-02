const Blog = require("../models/blogModel");
const User = require("../models/userModel");
async function createBlog(req, res) {
  try {
    const data = req.body;
    const newBlog = await Blog.create(data);
    await User.findByIdAndUpdate(data.author, { 
      $push: { blogs: newBlog._id } 
  });
    res.send(newBlog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
      
      console.error('Validation Errors:', errorMessages);
      res.status(400).send({
        message: 'Validation failed',
        errors: errorMessages
      });
    } else {
      console.error('Error:', error);
      res.status(401).send('Cannot create blog');
    }
  }
}

async function getBlogs(req, res) {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.send(blogs);
  } catch (error) {
    console.error(error);
    res.status(401).send('Cannot get blogs');
  }
}


async function getBlogById(req, res) {
    try {
      const { query } = req.query;
      console.log(query);
      const users = await User.find({ name: { $regex: query, $options: "i" } });
      const userIds = users.map(user => user._id);
      const searchConditions = [];
      if (userIds.length > 0) {
        searchConditions.push({ author: { $in: userIds } });
      }

        searchConditions.push({ title: { $regex: query, $options: "i" } });

        searchConditions.push({ tags: { $regex: query, $options: "i" } });

        const blogs = await Blog.find({ $or: searchConditions }).populate("author", "name email"); 

      res.send(blogs);
    } catch (error) {
      console.error(error);
      res.status(401).send('Cannot get blog');
    }
}


const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, body, photo, tags } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (title) blog.title = title;
    if (body) blog.body = body;
    if (photo) blog.photo = photo;
    if (tags) blog.tags = tags;

    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
      const { blogId } = req.params;

      const blog = await Blog.findById(blogId);
      if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
      }

      await Blog.findByIdAndDelete(blogId);

      await User.findByIdAndUpdate(blog.author, { $pull: { blogs: blogId } });

      res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};


module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };