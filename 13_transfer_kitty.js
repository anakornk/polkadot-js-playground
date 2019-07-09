const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");

const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

async function main() {
  // Initialise the provider to connect to the local node
  const provider = new WsProvider("ws://127.0.0.1:9944");

  // Create the API and wait until ready
  const api = await ApiPromise.create({
    types: {
      Kitty: "[u8; 16]",
      KittyIndex: "u32",
      KittyLinkedItem: {
        prev: 'Option<KittyIndex>',
        next: 'Option<KittyIndex>'
      }
    },
    provider
  });

  const keyring = new Keyring({ type: "sr25519" });
  const alice = keyring.addFromUri("//Alice");
  // Create a extrinsic, transfer kitty_id 0 to BOB
  const transaction = api.tx.kitties.transfer(BOB, 0);
  // Sign and send the transaction using our account
  const hash = await transaction.signAndSend(alice);

  console.log("Transfer sent with hash", hash.toHex());  

}

main()
  .catch(console.error)
  .finally(() => process.exit());
