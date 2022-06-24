import React, { Component } from "react";
import Pokens from "./contracts/Pokens.json";
import TokenSale from "./contracts/TokenSale.json";
import Kyc from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded:false};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        Pokens.abi,
        Pokens.networks[this.networkId] && Pokens.networks[this.networkId].address ,
      );

      this.tokensaleInstance = new this.web3.eth.Contract(
        TokenSale.abi,
        TokenSale.networks[this.networkId] && TokenSale.networks[this.networkId].address ,
      );

      this.kycInstance = new this.web3.eth.Contract(
        Kyc.abi,
        Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address ,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Poken Sale!</h1>
        <p>Get your pokens today!</p>
        <h2>KYC Whitelisting</h2>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
