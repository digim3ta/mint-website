import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import Nav from "./partials/Nav";
import Footer from "./partials/Footer";
import Roadmap from "./Roadmap";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div`
  margin-top: 1rem;
`;

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main>
      <Nav />
      <section id="mainContent">
        <div className="container u-text-align_center">
            <div><img src="../boryoku-dragons-logo.png" className="logo u-margin-bottom_small" alt="Boryoku Dragon" /></div>
            <div><img src="../dragonz-ani.gif" className="ani-gif u-margin-bottom_small" alt="Boryoku Dragon" /></div>

              <div className="bg-layer">
                <div>
                  <p className="u-margin-bottom_small">Bōryoku Dragonz are an exclusive collection of 1,111 Dragon NFTs on Solana, backed by a top team of NFT collectors, designers, community builders, and artists.</p>
                  <p className="u-margin-bottom_small">The project brings a fresh design to Solana, with daily token airdrops, a breeding game with token burning mechanics, and a multi-chain community that completely transcends a simple PFP offering.</p>
                  <p className="u-margin-bottom_small">Bōryoku Dragonz bridge the gap between high end 3D models and low resolution pixel art, featuring reknown pixel artists Yes I Do (<a href="https://twitter.com/Yes_I_Do_pixels" target="_blank" rel="noreferrer">@Yes_I_Do_pixels</a>) and Pixeldoshi (<a href="https://twitter.com/pixeldoshi" target="_blank" rel="noreferrer">@pixeldoshi</a>).</p>
                  <p className="u-margin-bottom_small">The team is committed to driving long term value for holders with a time horizon in years, not weeks or months, and have all the expertise to deliver on their vision, roadmap, and much more.</p>
                  <p className="u-margin-bottom_small">The Bōryoku Dragonz have arrived, and they are here to stay!</p>
                </div>
              </div>
            
            {wallet && (
              <p className="u-margin-top_small">Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
            )}

            {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>}

            {/* {wallet && <p>Total Available: {itemsAvailable}</p>}

            {wallet && <p>Redeemed: {itemsRedeemed}</p>}

            {wallet && <p>Remaining: {itemsRemaining}</p>} */}

            <MintContainer>
              {!wallet ? (
                <ConnectButton>Connect Wallet</ConnectButton>
              ) : (
                <MintButton
                  disabled={isSoldOut || isMinting || !isActive}
                  onClick={onMint}
                  variant="contained"
                >
                  {isSoldOut ? (
                    "SOLD OUT"
                  ) : isActive ? (
                    isMinting ? (
                      <CircularProgress />
                    ) : (
                      "MINT"
                    )
                  ) : (
                    <Countdown
                      date={startDate}
                      onMount={({ completed }) => completed && setIsActive(true)}
                      onComplete={() => setIsActive(true)}
                      renderer={renderCounter}
                    />
                  )}
                </MintButton>
              )}
            </MintContainer>

            <Snackbar
              open={alertState.open}
              autoHideDuration={6000}
              onClose={() => setAlertState({ ...alertState, open: false })}
            >
              <Alert
                onClose={() => setAlertState({ ...alertState, open: false })}
                severity={alertState.severity}
              >
                {alertState.message}
              </Alert>
            </Snackbar>
          
        </div>
      </section>

      <section>
        <Roadmap />
      </section>

      <Footer />
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
