
PLAID TOKENS

1. Get the LINK_TOKEN from the plaid through backend and provide it to frontend.
2. Then user will do the authentication. Once authenticated we will give PUBLIC_TOKEN to backend through frontend
3. Send PUBLIC_TOKEN  from backend to plaid API and receive ACCESS_TOKEN
4. Provide this ACCESS_TOKEN to authentication API which would give the account and routing numbers.
5. Also store ACCESS_TOKEN in the database.


HOW TO RUN:

1. Run Server. (Server running on port 8000)
2. Run Client. (Client should run on port 5173)
3. Click the button "Connect a bank account" and follow the steps.
4. Acceess Token and Auth details would be printed in Console.
