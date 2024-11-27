const axios = require("axios");

async function getToken(domain, client_id, client_secret, audience) {
    const options = {
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret,
        audience: audience
    })
    };
    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error.response ? error.response.data : error.message);
    }
}

async function changePassword(domain, token, userId, newPassword) {
    const options = {
        method: 'PATCH',
        url: `https://${domain}/api/v2/users/${userId}`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        data: {password: newPassword, connection: 'Username-Password-Authentication'}
      };
    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error.response ? error.response.data : error.message);
    }
}

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
  
    const url = `https://${domain}/oauth/token`;
  
    try {
      const response = await axios.post(url, data, {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user token', error.response ? error.response.data : error.message);
    }
}

(async () => {
    try {
        const domain = 'dev-7sfm4dwi0agzg42e.us.auth0.com';
        const client_id = '2rt9zMZergxHgi7SqMDSo2nBLXw2gHV3';
        const client_secret = 'UhwrkkaOHZ8jLwirvoivMAG8n1AeEe6NfI1itImdyjEbAzsygoo0Pjizl_HuYRD6';
        const audience = 'https://dev-7sfm4dwi0agzg42e.us.auth0.com/api/v2/';
        
        const email = 'some_user@gmail.com';
        const password = '#Aa12345678';
        const user_id = 'auth0|67462aebfce86d419fc2b535';

        //Створюємо токен
        const tokenData = await getToken(domain,client_id, client_secret, audience);
        //console.log(tokenData);

        //Міняємо пароль
        const res = await changePassword(domain, tokenData.access_token, user_id, password + 'a');
        //console.log(res);

        //Спробуємо створити юзер токен зі старим паролем
        const userToken1 = await getUserTokens(domain, audience, client_id, client_secret, email, password);
        console.log(userToken1);

        //Спробуємо створити юзер токен з новим паролем
        const userToken2 = await getUserTokens(domain, audience, client_id, client_secret, email, password+'a');
        console.log(userToken2);

    } catch (error) {
      console.error('Operation failed:', error);
    }
  })();