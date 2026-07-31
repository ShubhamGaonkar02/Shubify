import axios from 'axios';

async function testCreds() {
  try {
    const id = 'fb4c78f8674d4e289fd496bbe0c1c2e2';
    const secret = 'f63f133236144386970657e2abd667ad';
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      },
    });
    console.log('SUCCESS', response.data);
  } catch (err) {
    console.log('ERROR', err.response?.data || err.message);
  }
}
testCreds();
