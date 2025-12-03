const axios = require('axios');

async function test() {
  try {
    console.log('Testing auth...');
    const response = await axios.post('http://localhost:9000/auth/user/emailpass', {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    });
    console.log('Success!');
    console.log('Token:', response.data.token);
  } catch (error) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

test();
