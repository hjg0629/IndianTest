import React, { Component } from "react";
import IndianContract from "./../../build/contracts/Indian.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    const IndianContract1 = require("./../../build/contracts/Indian.json");
    this.state = {
      indianInstance: null,
      myAccount: null,
      myGame: 0,
      web3: null
    };
  }

  componentDidMount = async() => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      console.log("web3");
      console.log(web3);
      console.log("accounts");
      console.log(accounts);
      console.log("NetWorkId");
      console.log(networkId);
      console.log("IndianContract");
      console.log(IndianContract);
      console.log("IndianContract.networks");
      console.log(IndianContract.networks);
      const deployedNetwork = IndianContract.networks[networkId];
      console.log("deployedNetwork");
      console.log(deployedNetwork);
      const instance = new web3.eth.Contract (
        IndianContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts: accounts[0], contract: instance});
      //console.log(this.state);
      console.log(instance);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  /*componentDidMount = async() => {
    const web32 = await getWeb3();
    web32()
      .then(results => {
        this.setState({
          web3: results.web3
        });
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }*/

  /*instantiateContract() {
    const contract = require("truffle-contract");
    const indian = contract(IndianContract);
    indian.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        indian.deployed().then(instance => {
          this.setState({ indianInstance: instance, myAccount: accounts[0] });
          this.updateMyGames();
        });
      }
    });
  }*/

  buyGame() {
    console.log(this.state.contract);
    console.log(this.state.accounts);
    console.log(this.state.contract.methods);
    this.state.contract.methods.buyGame().send({
      from: this.state.accounts,
      value: this.state.web3.utils.toWei('10', 'ether'),
      gas: 900000
    })
  }

  sellMyGame() {
    this.state.contract.sellMyGame(this.state.web3.utils.toWei('10', 'ether'), {
      from: this.state.accounts[0],
      gas: 900000
    });
  }

  updateMyGames() {
    this.state.contract.getMyGame().then(result => {
      this.setState({ myGame: result.toNumber() });
    })
  }

  render() {
    return <div className="App">
      <h1>게임의 가격: 10ETH</h1>
      <button onClick={() => this.buyGame()}>구매하기</button>
      <p>내가 가진 게임: {this.state.myGame}</p>
      <button onClick={() => this.sellMyGame()}>
        판매하기 (판매 가격: {10 * this.state.myGame})
        </button></div>;
  }
}

export default App;