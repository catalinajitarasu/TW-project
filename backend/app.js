
const http = require('http');
const mongoose = require("mongoose");
const url = require('url')
const hostname = '127.0.0.1';
const port = 8000;

const routes = require('./routes');


const server = http.createServer( async(req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const handler = routes.find(route => route.path === parsedUrl.pathname && route.method === req.method);
  console.log(handler)
  if (handler) {
    try {
      await handler.controller(req, res);
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ecd1yaf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, 
  { 
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  .then(res=>{
    server.listen(port, hostname, () => {
      console.log(`Server running on port ${port}/`);
    });
})
.catch(error=>{
    console.log(error);
    res.send(error)
})

