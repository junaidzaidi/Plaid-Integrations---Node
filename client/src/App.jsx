import { useEffect, useState } from 'react'
import axios from "axios"
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { usePlaidLink } from 'react-plaid-link';

// ...


axios.defaults.baseURL = "http://localhost:8000"

function PlaidAuth({publicToken}) {

  useEffect( () => {
    async function fetchData() {
      const accessToken = await axios.post("/api/exchange_public_token", {public_token: publicToken});
      console.log("ACCESS TOKEN", accessToken.data)
      const auth = await axios.post('/api/auth/get', { access_token: accessToken.data.accessToken})
      console.log("Auth Data", auth.data)
    }
    fetchData();
  }, []);

  return (<span>{publicToken}</span>);
}

function App() {

  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState()
  
  useEffect( () => {
    async function fetch() {
      const response = await axios.post("/api/create_link_token");
      setLinkToken(response.data.link_token)
      console.log("Link Token Set To", response.data.link_token)
    }
    fetch();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token)
      console.log("Success", public_token, metadata)
    },
  });

  
    return publicToken ? 
    
    (<PlaidAuth publicToken={publicToken} />) : 
    
    (<button onClick={() => open()} disabled={!ready}>
        Connect a bank account
    </button>  
  )

}

export default App
