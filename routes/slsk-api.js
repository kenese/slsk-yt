var express = require('express');
var router = express.Router();
fs = require('fs');

const { connect } = require('slsk-client')

function saveResults(search_string, results) {
  const json = JSON.stringify(results);
  fs.writeFile(`./${search_string}.json`, json, 'utf8', function (err) {
    if (err) {
      console.log(err);//;
    } else {
      //Everything went OK!
    }
  });
}

let client
async function getClient () {
  return new Promise((resolve, reject) => {
    if (client) {
      resolve(client)
    } else {
      connect({
        user: 'blurtted',
        pass: 'nononono'
      }, (err, clint) => {
        if (err) {
          console.log('Slsk Client connect failed: ' + err);
          reject(err);
        }
        client = clint;
        resolve(client);
      });
    }
      
  })
}

async function search (client, searchString) {

  return  new Promise((resolve, reject) => {
    client.search({
      req: searchString,
      timeout: 8000
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}

/* GET search results. */
router.get('/', async function(req, res, next) {
  
  const { search_string } = req.query;
  if (!search_string ) {
    res.send('');
  }

  const fromeFile = getFromFile(search_string);
  if (fromeFile) {
    res.send(fromeFile);
  }
  
  client = await getClient();
  const results = await search(client, search_string);
  saveResults(search_string, results);

  res.send(results);
});

module.exports = router;

function getFromFile(search_string) {
  debugger;
  try {
    const file = fs.readFileSync(`./${search_string}.json`, { encoding: 'utf8' });
    return JSON.parse(file);
  } catch (error) {
    console.log(error)
  }
  return null;
}

