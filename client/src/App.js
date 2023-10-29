import React, { useEffect, useState } from "react";
import Navbar from "./comp/Navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import TakeLoan from "./comp/TakeLoan";
import RepayLoan from "./comp/RepayLoan";
import LiquidateNFT from "./comp/LiauidateNFT";

/* Sepolia Config */
import {
  LendBorrowContractAddressOnSepolia,
  LendBorrowContractABIOnSepolia,
} from "./contract_Config/contract_Config/SEPOLIA/LendBorrowConfig";
import {
  BasicNFTContractAddressOnSepolia,
  BasicNFTContractABIOnSepolia,
} from "./contract_Config/contract_Config/SEPOLIA/BasicNFTConfig";

/* Polygon Config */
import {
  LendBorrowContractABIOnPolygon,
  LendBorrowContractAddressOnPolygon,
} from "./contract_Config/contract_Config/POLYGON/LendBorrowConfig";
import {
  BridgeContractAddressOnPolygon,
  BridgeContractABIOnPolygon,
} from "./contract_Config/contract_Config/POLYGON/BridgeConfig";
import {
  BasicNFTContractAddressOnPolygon,
  BasicNFTContractABIOnPolygon,
} from "./contract_Config/contract_Config/POLYGON/BasicNFTConfig";

const { ethers } = require("ethers");

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [sepoliaConfig, setSepoliaConfig] = useState({
    lendBorrow: null,
    basicNFT: null,
  });
  const [polygonConfig, setPolygonConfig] = useState({
    lendBorrow: null,
    basicNFT: null,
  });

  const connectWallet = async () => {
    // console.log("ulla");
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

    // console.log("ulla2");


      try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        await connectContract(signer);
      } catch (error) {
        console.error(error);
        setShowConnectButton(true);
      }
    } else {
      setShowConnectButton(true);
    }
  };

  const connectContract = async (signer) => {
    const chainId = await signer.getChainId();
    if (chainId === 80001) {
      console.log("Polygon");
      const lendBorrowContractOnPolygon = new ethers.Contract(
        LendBorrowContractAddressOnPolygon,
        LendBorrowContractABIOnPolygon,
        signer
      );
      const nftContractOnPolygon = new ethers.Contract(
        BasicNFTContractAddressOnPolygon,
        BasicNFTContractABIOnPolygon,
        signer
      );
      setPolygonConfig({
        lendBorrow: lendBorrowContractOnPolygon,
        basicNFT: nftContractOnPolygon,
      });
    } else {
      console.log("Sepolia");
      const lendBorrowContractOnSepolia = new ethers.Contract(
        LendBorrowContractAddressOnSepolia,
        LendBorrowContractABIOnSepolia,
        signer
      );
      const nftContractOnSepolia = new ethers.Contract(
        BasicNFTContractAddressOnSepolia,
        BasicNFTContractABIOnSepolia,
        signer
      );
      setSepoliaConfig({
        lendBorrow: lendBorrowContractOnSepolia,
        basicNFT: nftContractOnSepolia,
      });
      const address = await signer.getAddress();
      const balanceOfToken = await sepoliaConfig.lendBorrow.giveERC20TokensBalanceOfBorrower(address);
      console.log(balanceOfToken)
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    } else {
      setShowConnectButton(true);
    }
  }, []);

  return (
    <div className="px-8 md:px-16">
      <Navbar />
      {provider ? (
        <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/takeLoan" element={<TakeLoan />} />
          <Route path="/repayLoan" element={<RepayLoan />} />
          <Route path="/liquidateNFT" element={<LiquidateNFT />} />
        </Routes>
      {/* ) : (    */}
          {showConnectButton ? (
            <div>
              <button
                className="md:ml-10 font-semibold bg-primaryColor p-4 px-8 text-backgroundColor rounded-lg mt-8"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
              <p>
                If you don't have MetaMask installed, you can{" "}
                <a
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  install it from the Chrome Web Store
                </a>
                .
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default App;
