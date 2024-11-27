const axios = require('axios');

async function getUserTokens(domain, audience, client_id, client_secret, username, password) {
  const data = {
    grant_type: 'password',
    audience: audience,
    client_id: client_id,
    client_secret: client_secret,
    username: username,
    password: password,
    scope: 'offline_access'
  };

  const url = 'https://' + domain +'/oauth/token';

  try {
    const response = await axios.post(url, data, {
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user token', error.response ? error.response.data : error.message);
    //throw error;
  }
}

async function getRefreshedToken(domain, client_id, client_secret, refresh_token) {
  const data = {
    grant_type: 'refresh_token',
    client_id : client_id,
    client_secret : client_secret,
    refresh_token : refresh_token,
  };

  const url = 'https://' + domain +'/oauth/token';

  try {
    const response = await axios.post(url, data, {
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
  }
}

(async () => {
  try {
      //Налаштування
      const domain = 'dev-7sfm4dwi0agzg42e.us.auth0.com';
      const client_id = '2rt9zMZergxHgi7SqMDSo2nBLXw2gHV3';
      const client_secret = 'UhwrkkaOHZ8jLwirvoivMAG8n1AeEe6NfI1itImdyjEbAzsygoo0Pjizl_HuYRD6';
      const audience = 'https://dev-7sfm4dwi0agzg42e.us.auth0.com/api/v2/';
      
      const email = 'some_user@gmail.com';
      const password = '#Aa12345678';

      //Отримати токени
      const data = await getUserTokens(domain, audience, client_id, client_secret, email, password);
      console.log(data);

      //Відібрати refresh_token
      const refreshToken = data.refresh_token;

      //Отримати оновлений токен
      const refreshedToken = await getRefreshedToken(domain, client_id, client_secret, refreshToken);
      console.log(refreshedToken);
  } catch (error) {
    console.error('Operation failed:', error);
  }
})();