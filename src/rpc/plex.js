'use strict';

const axios = require('axios');
const ip = require('ip');

function getRelevantData(session){
  return {
    state: session['Player']['state'],
    library: session['librarySectionTitle'],
    title: session['grandparentTitle'],
    season: session['parentIndex'],
    episode: {
      title: session['title'],
      index: session['index'],
      duration: session['duration'],
      progress: session['viewOffset']  
    }
  }
}

async function getPlexSession(host, port){
  const resp = await axios.get(`http://${host}:${port}/status/sessions`);

  if(resp['status'] === 200){
    const data = resp['data'];
    if(data['MediaContainer']['size'] === '0'){
      return '';
    }
    try{
      for(const session of data['MediaContainer']['Metadata']){
        if(ip.address() === session['Player']['address']){
          return getRelevantData(session);
        }
      }
    } catch(e){
      return '';
    }
    throw new Error('Could not match local IP to active Plex session');
  }
  throw new Error('Plex server response status != 200');
}

module.exports.getPlexSession = getPlexSession;