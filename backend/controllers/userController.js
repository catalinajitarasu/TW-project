const User = require("../models/userModel")
const bcrypt = require('bcryptjs')
const querystring = require('querystring');
const url = require('url');

exports.signUp = async(req, res)=>{
    let body = '';
    req.on('data', (chunk) => {
      body +=chunk.toString();
    });
    req.on('end', async () => {
    const data = JSON.parse(body)
      try{
        console.log(data)
        // hash the password
        data.password = await bcrypt.hash(data.password, 12);
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

exports.updateUser = async(req, res)=>{
    let body = '';
    req.on('data', (chunk) => {
      body +=chunk.toString();
    });
    req.on('end', async () => {
    const data = JSON.parse(body)
      try{
        console.log(data)
        let user = await User.findOne({email: data.oldEmail})
        if(user === undefined || user === null){
            res.statusCode=404
            res.statusMessage="User not found!"
            res.end()
            return
        }
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.email = data.newEmail
        user.password = await bcrypt.hash(data.password, 12);
        user.age = data.age
        user.gender = data.gender
        user.city = data.city
        user.country = data.country
        user.diet = data.diet
        user.allergies = data.allergies
        user.preferences = data.preferences

        console.log(user)
        const response = await user.save()
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
        let user = await User.findOne({email: data.email})
        if(user === undefined || user === null){
            res.statusCode=404
            res.statusMessage="User not found!"
            res.end()
            return
        }
        console.log(user)
        console.log(data.password)
        const isEqual = await bcrypt.compare(data.password, user.password);
        if(!isEqual){
          res.statusCode=401
          res.statusMessage="Wrong password!"
          res.end()
          return
        }
        res.statusCode=200
        const dataReturned = {
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName, 
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

exports.getUserCart = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query)
    console.log(queryParams)

    let user = await User.findOne({email: queryParams.userEmail}).populate('cart')
    if(user === undefined || user === null){
        res.statusCode=404
        res.statusMessage="User not found!"
        res.end()
        return
    }
    console.log(user)

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(user.cart));
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

exports.emptyCart = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body +=chunk.toString();
  });
  req.on('end', async () => {
  const data = JSON.parse(body)
    try{
      console.log(data)
      let user = await User.findOne({email: data.userEmail})
      if(user === undefined || user === null){
          res.statusCode=404
          res.statusMessage="User not found!"
          res.end()
          return
      }

      user.cart = []
      await user.save()

      res.end(JSON.stringify({message: 'Cart updated'}));
    }
    catch(error){
      console.log(error)
      res.statusCode = 500;
      res.end();
    }
  });

};

exports.removeCartProduct = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body +=chunk.toString();
  });
  req.on('end', async () => {
  const data = JSON.parse(body)
    try{
      console.log(data)
      let user = await User.findOne({email: data.userEmail})
      if(user === undefined || user === null){
          res.statusCode=404
          res.statusMessage="User not found!"
          res.end()
          return
      }

      const newCart = user.cart.filter(productId => productId.toString() !== data.productId.toString())
      user.cart = newCart
      console.log("FINAL USER")
      console.log(user.cart)
      await user.save()

      res.end(JSON.stringify({message: 'Cart updated'}));
    }
    catch(error){
      console.log(error)
      res.statusCode = 500;
      res.end();
    }
  });

};


exports.getUserFavorites = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query)
    console.log(queryParams)

    let user = await User.findOne({email: queryParams.userEmail}).populate('favorites')
    if(user === undefined || user === null){
        res.statusCode=404
        res.statusMessage="User not found!"
        res.end()
        return
    }
    console.log(user)

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(user.favorites));
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

exports.emptyFavorites = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body +=chunk.toString();
  });
  req.on('end', async () => {
  const data = JSON.parse(body)
    try{
      console.log(data)
      let user = await User.findOne({email: data.userEmail})
      if(user === undefined || user === null){
          res.statusCode=404
          res.statusMessage="User not found!"
          res.end()
          return
      }

      user.favorites = []
      await user.save()

      res.end(JSON.stringify({message: 'Favorites list updated'}));
    }
    catch(error){
      console.log(error)
      res.statusCode = 500;
      res.end();
    }
  });

};

exports.removeFavoritesProduct = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body +=chunk.toString();
  });
  req.on('end', async () => {
  const data = JSON.parse(body)
    try{
      console.log(data)
      let user = await User.findOne({email: data.userEmail})
      if(user === undefined || user === null){
          res.statusCode=404
          res.statusMessage="User not found!"
          res.end()
          return
      }

      const newFavorites = user.favorites.filter(productId => productId.toString() !== data.productId.toString())
      user.favorites = newFavorites
      console.log("FINAL USER")
      console.log(user.favorites)
      await user.save()

      res.end(JSON.stringify({message: 'Favorites list updated'}));
    }
    catch(error){
      console.log(error)
      res.statusCode = 500;
      res.end();
    }
  });

};