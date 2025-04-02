const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/create', blogController.createBlog);
router.get('/all', blogController.getBlogs);
router.get('/search', blogController.getBlogById);
router.put('/:blogId', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);

module.exports = router;