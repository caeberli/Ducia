import React from 'react';
import { DAppProvider, ChainId, Kovan, Rinkeby, Config } from '@usedapp/core';
import { Header } from "./components/Header"
import { Main } from "./components/Main"
import { Container } from "@material-ui/core"
import { getDefaultProvider } from 'ethers'



const config: Config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: getDefaultProvider('rinkeby'),
  },
}


function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
