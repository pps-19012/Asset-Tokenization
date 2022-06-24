import React, { Component } from "react";
import Pokens from "./contracts/Pokens.json";
import TokenSale from "./contracts/TokenSale.json";
import Kyc from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded:false, kycAddress:"0x123...", tokenSaleAddress:null, userTokens:0};

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
      this.listenToTokenTransfer();
      this.setState({loaded:true, tokenSaleAddress:TokenSale.networks[this.networkId].address}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleBuyToken = async () => {
    await this.tokensaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
  }

  listenToTokenTransfer = async () => {
    this.tokenInstance.events.Transfer({to:this.accounts[0]}).on("data", this.updateUserTokens);
  }

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
  }

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods.setKYCCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("KYC for "+ this.state.kycAddress+" is completed!")
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Poken Sale!</h1>
        <p>Get your pokens today!</p>
        <h2>KYC Whitelisting</h2>
        Address to allow: <input type="text" name="kycAddress" value = {this.state.kycAddress} onChange = {this.handleInputChange} />
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
        <h2>Buy Tokens</h2>
        <p>If you want to buy tokens, send wei to this address: {this.state.tokenSaleAddress}</p>
        <p>You currently have : {this.state.userTokens} Pokens</p>
        <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>
      </div>
    );
  }
}

export default App;
