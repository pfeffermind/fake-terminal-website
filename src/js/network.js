/*
HINTPAD NETWORK
-> server: read/parse json sent by Hintpad, using Nodejs + faye websocket
*/
var http = require("http"),
url = require("url"),
fs = require("fs"),
port = process.argv[2] || 8888;

const { spawn } = require("child_process");
const path    = require('path');
const mPath = path.resolve(__dirname, '..');
//const vlc_path = "/Applications/VLC.app/Contents/MacOS/VLC"  // macOS
const vlc_path = "vlc"  // ubuntu
var logovidProcess;

var faye = require ('faye');
var faye_server = new faye.NodeAdapter ({mount: '/faye', timeout: 120});
var http_server = http.createServer(function(req,res){
  // get the DATA
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    console.log(`Data chunk available: ${chunk}`)

    faye_server.getClient().publish('/hintpad',
    {
      action: JSON.parse(data).action,
      hip: JSON.parse(data).hip,
    });

  });
  req.on('end', () => {
    // end of data
  })

  // show the page
  var uri = url.parse(req.url).pathname
  , filename = path.join(process.cwd(), './', uri);

  fs.exists(filename, function(exists) {

    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("---> 404 Not Found\n");
      res.end();
      return;
    }

    // display the html containing the phaser 3 canvas
    if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function(err, file) {

                if (err) {
                    res.writeHeader(404, {
                          'Content-Type': 'text/plain'
                      })
                      res.write('-> 404 Not Found')
                      res.end()
                      return
                  }

                  if (req.url.endsWith('.html')) {
                      /*res.writeHeader(200, {
                          'Content-Type': 'text/html'
                      })*/
                      res.setHeader("Content-Type", "text/html");
                  }

                  if (req.url.endsWith('.js')) {
                      /*res.writeHeader(200, {
                          'Content-Type': 'application/javascript',
                      })*/
                      res.setHeader("Content-Type", "application/javascript");
                  }

                  if (req.url.endsWith('.mjs')) {
                      /*res.writeHeader(200, {
                          'Content-Type': 'module',
                      })*/

                      res.setHeader("Content-Type", "application/javascript");
                  }

      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  });
});

faye_server.attach(http_server);
http_server.listen(port,10);
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

// #### #### #### #### #### #### #### #### #### #### #### #### #### ####

function getLocalIP() {
  var os = require( 'os' );
  var networkInterfaces = os.networkInterfaces( );
  var ipAddr;

  Object.keys(networkInterfaces).forEach(function (ifname) {
    networkInterfaces[ifname].forEach(function (iface) {
      console.log("iface.address: " + iface.address );
      if (iface.address.includes("192")) {
         ipAddr = iface.address;
      }
    });
  });

  faye_server.getClient().publish('/hintpad',
  {
    action: ipAddr
  });
  console.log("local IP: " + ipAddr );
}
