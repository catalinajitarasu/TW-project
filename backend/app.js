
const http = require('http');
const mongoose = require("mongoose");
const url = require('url')
const hostname = '127.0.0.1';
const port = 8000;

const routes = require('./routes');


const server = http.createServer( async(req, res) => {
  if (req.method === 'OPTIONS') {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.writeHead(204);
    res.end();
    return;
}
  const parsedUrl = url.parse(req.url, true);
  console.log(parsedUrl.pathname)
  console.log(`routes ${routes}`)
  console.log(`req.method ${req.method}`)
  const handler = routes.find(route => route.path === parsedUrl.pathname &&
                                       route.method === req.method);
  console.log(`handler ${handler}`)
  if (handler || handler !==undefined) {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
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

