const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


// @route    POST api/posts
// @desc     Create post
// @access   Private


router.post('/', auth, 
  check('text', 'text is required').notEmpty(),
  async(req,res) => {
      const errors =  validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({ errors: errors.array() });
      }


      try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);

      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
      }

      
   }
  );

  
// @route    GET api/posts
// @desc     get all post
// @access   Private

router.get('/', auth, async (req, res) => {
 
  try {

    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

 }
);

// @route    GET api/posts
// @desc     get post by id
// @access   Private

router.get('/:id', auth, async (req, res) => {
 
  try {

    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
    
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }

 }
);

// @route    DELETE api/posts
// @desc     delete a post
// @access   Private

router.delete('/:id', auth, async (req, res) => {
 
  try {

    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User not Authorised' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
    
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }

 }
);

// @route    PUT api/posts/like/:id
// @desc     like a post
// @access   Private

router.put('/like/:id', auth, async (req, res) => {
 try {
  
  const post = await Post.findById(req.params.id);

  //check if the post has been already liked
  if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
    return res.status(400).json({ msg: 'post already liked' });
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();
  res.json(post.likes);

 } catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
 }

});

// @route    PUT api/posts/unlike/:id
// @desc     unlike a post
// @access   Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
   
   const post = await Post.findById(req.params.id);
 
   //check if the post has been already liked
   if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
     return res.status(400).json({ msg: 'post has not been liked yet' });
   }
 
   //get remove index
   const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);


   post.likes.splice(removeIndex, 1);
 
   await post.save();
   res.json(post.likes);
 
  } catch (err) {
   console.error(err.message);
   res.status(500).send('Server Error');
  }
 
 });

 // @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private


router.post('/comment/:id', auth, 
check('text', 'text is required').notEmpty(),
async(req,res) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }


    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment ={
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    
 }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     delete comment
// @access   Private

router.delete('/comment/:un id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    //make sure comment exists
    if(!comment){
      return res.status(404).json({ msg: 'comment does not exist' });
    }

    //check user
    if(comment.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'user not authorised' });
    }

    //get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);


    post.comments.splice(removeIndex, 1);
  
    await post.save();
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


module.exports = router