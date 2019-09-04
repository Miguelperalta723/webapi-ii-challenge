const express = require('express')

const db = require('./data/db')

const server = express();

server.use(express.json())




server.post('/api/post', (req , res) => {
    const posts  = req.body;
    db.insert(posts)
    .then(post => {
        if(post){
            res.status(200).json(post)
        } else {
            res.status(404).json({
                message: 'try again loser'
            })
        }
    })
})


server.post('/api/posts/:id/comments', (req, res) => {
    
    if (req.body.text) {
        Posts.findById(req.params.id)
            .then(post => {
                if (post.length) {
                    Posts.insertComment({ ...req.body, post_id: req.params.id })
                        .then(comment => {
                            res.status(201).json(comment);
                        })
                        .catch(error => {
                            res.status(500).json({ error: error, message: 'The posts information could not be retrieved.' });
                        });
                } else {
                    res.status(404).json({ message: 'The post with the specified ID does not exist.' });
                }
            })
            .catch(() => {
                res.status(500).json({ message: 'The posts information could not be retrieved.' });
            });
    } else {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
    }
});


server.get('/api/posts', (req, res) => {
    db.find()
    .then(post => {
        res.status(200).json(post)
    })
    .catch(() => {
        res.status(500).json({
            message: 'you fucked up bruh'
        }) 
    })
})


server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(() => {
        res.status(500).json({
            message: 'you fucked up bruh'
        }) 
    })
})


server.delete('/api/posts/:id', (req , res) => {
   const { id } = req.params;
    db.remove(id)
    .then(deletedPost => {
        if(deletedPost){
           res.json(deletedPost); 
        } else {
            res.status(404).json({
                message: 'invalid post id'
            })
        }
        
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'failded to delete post'
        });
    });
})


server.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db.update(id, changes)
    .then(updatedPost => {
        if(updatedPost){
           res.json(updatedPost); 
        }  else {
            res.status(404).json({
                message: 'invalid user id'
            })
        }
        
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'failded to update user'
        });
    });
})

server.get('/api/posts/:id/comments', (req, res) => {

    Posts.findById(req.params.id)
        .then(post => {
            if (post.length) {
                Posts.findPostComments(req.params.id)
                    .then(comment => {
                        res.status(200).json(comment);
                    })
                    .catch(() => {
                        res.status(500).json({ message: "The post's comments could not be retrieved." });
                    });
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ message: 'The posts information could not be retrieved.' });
        });
});



module.exports = server;