const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': "64b8d7983d2abf001ba92787",
      'PLAID-SECRET': "b2933fd16011e877c0002135de9fa7",
    },
  },
});

const plaidClient = new PlaidApi(configuration);

app.post('/api/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    // const clientUserId = user.id;
    const plaidRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        // client_user_id: "clientUserId",
        client_user_id: "user",
      },
      client_name: 'Plaid Test App',
      products: ['auth'],
      language: 'en',
    //   webhook: 'https://webhook.example.com',
      redirect_uri: 'http://localhost:5173/',
      country_codes: ['US'],
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
      response.json(createTokenResponse.data);
    } catch (error) {
        response.status(500).send("Failed Request")
      // handle error
    }
  });


app.post('/api/exchange_public_token', async function (
    request,
    response,
    next,
  ) {
    const publicToken = request.body.public_token;
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
  
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = plaidResponse.data.access_token;
    //   const itemID = response.data.item_id;
  
      response.json({ accessToken });
    } catch (error) {
      // handle error
      response.status(500).send("Failed Getting Access Token")
    }
  });

app.post('/api/auth', async function (request, response) {
    try {
        const accessToken = request.body.access_token
        const plaidRequest = {
            access_token: accessToken,
          };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        response.json(plaidResponse.data)
            // const accountData = response.data.accounts;
            // const numbers = response.data.numbers;         
    }
    catch (error) {
        response.status(500).send("Failed to Authenticate User")
    }
});

app.post("/hello", (request, response) => {
    response.json({message: `Hello World!!  ${request.body.name}`});
});


app.listen(port, () => console.log(`Server has started listening on port ${port}`));