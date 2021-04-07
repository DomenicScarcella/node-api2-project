// implement your posts router here
const Post = require('./posts-model');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'The posts information could not be retrieved'});
        });
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'The post information could not be retrieved'});
        });
});

router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
        .then(comments => {
            if (comments.length > 0) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'The comments information could not be retrieved'});
        });
});

router.post('/', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({message: 'Please provide title and contents for the post'})
    } else {
        Post.insert(newPost)
            .then(post => {
                const {id} = post;
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({message: 'There was an error while saving the post to the database'});
            });
    }
    
});

router.put('/:id', async (req, res) => {
    const updatePost = req.body;
    if (!updatePost.title || !updatePost.contents) {
        res.status(400).json({message: 'Please provide title and contents for the post'})
    } else {
        Post.update(req.params.id, updatePost)
            .then(() => {
                return Post.findById(req.params.id)
            })
            .then(post => {
                if (post) {
                    res.status(200).json(post);
                } else {
                    res.status(404).json({message: 'The post with the specified ID does not exist'});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({message: 'The post information could not be modified'});
            });
    }

});

router.delete('/:id', async (req, res) => {
    const oldPost = await Post.findById(req.params.id)
    Post.remove(req.params.id)
        .then(count => {
            if (count) {
                res.status(200).json(oldPost);
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'The post could not be removed'});
        });
});

module.exports = router;