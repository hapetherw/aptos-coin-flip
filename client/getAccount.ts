// const { HexString } = require("aptos/dist/hex_string");

// const { AccountAddress } = require("aptos/dist/transaction_builder/aptos_types/account_address");

// const {BCS} = require('aptos')
// const { SHA3 } = require('sha3');
// const {sha3_256} = require('js-sha3');
// const hex = require('string-hex')

// const resourceAddress = "915e47f986471a5faba9cb2f726611cd554344419ddd6d5b3e9f00bcafd30169"

// const sourceAddress = "9db1d65a321e4a86f8098cb04e76fce098890b84211fa06d65f24dc644bf0fec"
// const seeds = hex("01")

// const source = BCS.bcsToBytes(AccountAddress.fromHex(sourceAddress));

// const see = new HexString(seeds).toUint8Array();

// let originBytes = new Uint8Array(source.length + see.length);
  
// originBytes.set(source);
// originBytes.set(see, source.length);

// const hash = new sha3_256.create();
// hash.update(Buffer.from(originBytes));

// const calculatedResourceAddress = hash.hex();

// console.log(calculatedResourceAddress);



