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
        let user = await User.find({email: data.email})
        if(user === undefined || user === null){
            res.statusCode=404
            res.statusMessage="User not found!"
            res.end()
            return
        }
        user = user[0]
        res.statusCode=200
        const dataReturned = {
          email: user.email, 
          name: user.name, 
          registerDate: user.registerDate, 
          token: 'erdtfyguhijofdxgchvjb' //TODO: replace hardcoded token
        }
        console.log(`user ${dataReturned}`)
        res.end(JSON.stringify(dataReturned));
      }
      catch(error){
        console.log(error)
        res.statusCode = 500;
        res.end();
      }
    });
}