const User = require("../models/userModel")

exports.signUp = async(req, res)=>{
    let body = '';
    req.on('data', (chunk) => {
      body +=chunk.toString();
    });
    req.on('end', async () => {
    const data = JSON.parse(body)
      try{
        const newUser = new User(data)
        console.log(newUser)
        const response = await newUser.save()
        console.log(`response ${response}`)
        res.statusCode=201
        res.end(JSON.stringify(response));
      }
      catch(error){
        console.log(error)
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
    });
}


exports.logIn = async(req, res)=>{
    let body = '';
    req.on('data', (chunk) => {
      body +=chunk.toString();
    });
    req.on('end', async () => {
    const data = JSON.parse(body)
      try{
        // const name = req.query.name
        const user = await User.find({email: data.email});
        if(user === undefined || user === null){
            res.statusCode=404
            res.statusMessage="User not found!"
            res.end()
            return
        }
        console.log(`user ${user}`)
        res.statusCode=200
        res.end(JSON.stringify(user));
      }
      catch(error){
        console.log(error)
        res.statusCode = 500;
        res.end();
      }
    });
}