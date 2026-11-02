const http = require('node:http');
const host = '127.0.0.1';
const port = Number(process.env.PERF_FIXTURE_PORT || 4177);
const server = http.createServer((req,res) => {
  if (req.url === '/health') {
    res.writeHead(200, {'content-type':'application/json'});
    return res.end(JSON.stringify({ok:true}));
  }
  if (req.url === '/') {
    res.writeHead(200, {'content-type':'text/html'});
    return res.end('<!doctype html><html><head><title>Performance CI Fixture</title></head><body><main>Healthy</main></body></html>');
  }
  res.writeHead(404);res.end('Not found');
});
server.listen(port,host,()=>console.log('Fixture ready at http://'+host+':'+port));
for (const sig of ['SIGTERM','SIGINT']) process.on(sig,()=>server.close(()=>process.exit(0)));
