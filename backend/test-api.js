const fetch = require('node-modules/node-fetch');

async function testVisitorAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/visitors/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'TestUser'
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Test error:', error);
  }
}

testVisitorAPI();
