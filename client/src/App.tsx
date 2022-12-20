import React from "react";
import "./App.css";
import { Header, Segment, Form, Button, Card, Image } from "semantic-ui-react";
import Startbar from "./Startbar";

import { Types, AptosClient, BCS } from "aptos";
import nacl from "tweetnacl";
var Buffer = require("buffer/").Buffer;

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

/** Convert string to hex-encoded utf-8 bytes. */

function App() {
  // Retrieve aptos.account on initial render and store it.

  type GameStore = {
    games?: Array<Game>;
  };

  type Game = {
    bet_amount?: string;
    coin_store: { value: string };
    game_id: string;
    joinee: { vec: [] };
    owner: string;
    owner_choice: boolean;
    result: { vec: Array<string> };
    room_creation_time: string;
    winner: { vec: [] };
  };

  const publishedAddress =
    "0xa1922ba9d7f65934c939d1161525d1ec97252d25c5f7536d448b43a69b092185";
  const urlAddress = window.location.pathname.slice(1).toLowerCase();
  const [address, setAddress] = React.useState("");
  const [roomDetails, setRoomDetails] = React.useState({
    roomId: "",
    betAmount: 0,
    choice: false,
  });
  const [games, setGames] = React.useState<GameStore>();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [present, setPresent] = React.useState(false);
  React.useEffect(() => {
    connectToWallet();
    fetchGames();
  }, []);

  const connectToWallet = async () => {
    const status = await (window as any).aptos.isConnected();
    if (!status) {
      const result = await window.aptos.connect();
      setAddress(result);
    } else {
      console.log("Wallet connected", urlAddress);
    }
  };

  const fetchGames = async () => {

    const all = await client.getAccountResources("0x238cd430923da47ce39ee11905880f162b8e46587e0a22dacf60634d924b7e80");
    console.log(all);

    const resource = await client.getAccountResource(
      publishedAddress,
      `${publishedAddress}::Flip::GameStore`
    );
    const data: GameStore = resource.data;
    if (data?.games !== undefined) {
      setGames(data);
      setPresent(true);
      console.log(data.games[0]);
    }
  };
  const handleCreateRoomChange = (value: boolean) => {
    console.log(value);
    console.log(games);
    console.log(address);
    setRoomDetails({
      ...roomDetails,
      choice: value,
    });
  };

  const handleRoomChange = (e: any) => {
    console.log(e.target.value);
    setRoomDetails({
      ...roomDetails,
      betAmount: e.target.value,
    });
  };

  const createRoom = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    const roomId = Math.floor(Math.random() * 100000) + 1;
    const response = await window.aptos.connect();
    const sender = response.address;

    const num = await client.estimateMaxGasAmount(sender);
    console.log(num);

    const transaction = {
      type: "entry_function_payload",
      function: `${publishedAddress}::Flip::create_room`,
      arguments: [roomId, roomDetails.betAmount, roomDetails.choice],
      type_arguments: [],
    };

    try {
      console.log(" in try here");
      const txnHash = await window.aptos.signAndSubmitTransaction(transaction);
      console.log(txnHash.hash);
      await client.waitForTransaction(txnHash.hash);
      console.log(" it wont come here");
      fetchGames();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
    }
  };

  const playGame = async (game_id: string) => {
    console.log(game_id);
    setIsSaving(true);

    const transaction = {
      type: "entry_function_payload",
      function: `${publishedAddress}::Flip::join_room`,
      arguments: [parseInt(game_id)],
      type_arguments: [],
    };

    try {
      console.log(" in try here");
      let result = await window.aptos.signAndSubmitTransaction(transaction);
      console.log(result);
      await client.waitForTransaction(result.hash);
      console.log(" it wont come here");
      fetchGames();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
    }
  };

  const claimRewards = async (game_id: string) => {
    console.log(game_id);
    setIsSaving(true);

    const transaction = {
      type: "entry_function_payload",
      function: `${publishedAddress}::Flip::claim_rewards`,
      arguments: [parseInt(game_id)],
      type_arguments: [],
    };

    try {
      console.log(" in try here");
      let result = await window.aptos.signAndSubmitTransaction(transaction);
      console.log(result);
      await client.waitForTransaction(result.hash);
      console.log(" it wont come here");
      fetchGames();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
    } 
  }

  return (
    <div className="App">
      <Startbar />
      <Header as="h1">Aptos Coin Flip</Header>
      <div className="content leftAlign">
        <Segment>
          <Header as="h2" dividing>
            Join or create
          </Header>
          <Form>
            <Form.Field>
              <label>Bet Amount</label>
              <input
                type="number"
                placeholder="Enter Bet Amount"
                onChange={handleRoomChange}
              />
            </Form.Field>
            <Form.Group inline>
              <label>Size</label>
              <Form.Radio
                label="Tails"
                value="0"
                checked={roomDetails.choice === false}
                onChange={() => handleCreateRoomChange(false)}
              />
              <Form.Radio
                label="Heads"
                value="1"
                checked={roomDetails.choice === true}
                onChange={() => handleCreateRoomChange(true)}
              />
            </Form.Group>
            {isSaving ? (
              <Button primary loading>
                Create Room
              </Button>
            ) : (
              <Button primary onClick={createRoom}>
                Create Room
              </Button>
            )}
          </Form>
          <Header as="h3">Games</Header>
          <Card.Group>
            {games?.games?.map((game, index) => {
              return (
                <Card>
                  <Card.Content>
                    <Card.Header>Game: {game.game_id}</Card.Header>
                    <Card.Meta>Bet Amount: {game.bet_amount}</Card.Meta>
                    <Card.Meta>
                      Room Owner Choice: {game.owner_choice ? "Tails" : "Heads"}
                    </Card.Meta>
                    {game.result.vec.length > 0 && <Card.Description>
                       Result: {game.result.vec[0] === "0" ? <strong>Tails</strong> : <strong>Heads</strong>}
                    </Card.Description>}
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      {game.winner.vec.length > 0 ? (
                         <Button basic color="red" onClick={() => claimRewards(game.game_id)}>
                          Claim
                        </Button>
                      ) : (
                        <Button basic color="green" onClick={() => playGame(game.game_id)}>
                          Play
                        </Button>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </Segment>
      </div>
    </div>
  );
}

export default App;
