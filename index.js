const express = require("express")
const shortid = require("shortid")

const server = express()

server.use(express.json())


const port = 8001
server.listen(port, () => console.log(`server running on port: ${port}`))

// Testing
server.get("/hello", (req, res) => {
    res.send("Hello World!");
});



let users = [
    {
        id: shortid.generate(),
        name: "Jorge",
        bio: "Likes to eat spicy food"
    }
]



// - Get request to /api/users
server.get('/api/users', (req, res) => {

    if (users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        })
    }
})

// - Post request to /api/users
server.post('/api/users', (req, res) => {
    const user = req.body;
    user.id = shortid.generate()

    if (!user.name || !user.bio) {
        res
            .status(400)
            .json({ error_message: 'Please provide name and bio for the user.' });
    } else if (user === undefined) {
        res.status(500)
            .json({ error_message: 'The users information could not be retrieved.' });
    } else {
        users.push(user);
        res.status(200).json(users);
    }
});

// - Get request by id to /api/users/:id
server.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);

    if (user) {
        res.status(200).json(user);
    } else if (user === undefined) {
        res.status(404)
            .json({ error_message: "The user with the specified ID does not exist." });
    } else {
        res.status(500)
            .json({ error_message: 'The users information could not be retrieved.' });
    }
});


// - Put request to /api/users/:id
server.put('/api/users/:id', (req, res) => {
    let user = users.find(user => user.id === req.params.id);

    const updates = req.body;

    if (!updates.name || !updates.bio) {
        res
            .status(404)
            .json({ error_message: 'Please provide name and bio for the user.' });
    } else if (user) {
        //when user has been found
        Object.assign(user, updates);
        res.status(200).json(user);
    } else {
        res
            .status(500)
            .json({ error_message: 'The user information could not be modified.' });
    }
});


// - Delete request to /api/users/:id
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    if (id) {
        users = users.filter(user => user.id != Number(id));
        res.status(200).json(users);
    } else {
        res.status(404).json({ errorMessage: 'The user with the specified ID does not exist' });
    }
});
