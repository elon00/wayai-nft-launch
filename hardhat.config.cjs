require("@nomicfoundation/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

/** @type import("hardhat/config").HardhatUserConfig */
function rpcUrl(networkName, envName, template) {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`${envName} is required to use the ${networkName} network`);
  }
  return template.replace("{id}", value);
}

function privateKey() {
  const key = process.env.PRIVATE_KEY;
  if (!key) throw new Error("PRIVATE_KEY is required for deployment networks");
  const normalized = key.startsWith("0x") ? key : `0x${key}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error("PRIVATE_KEY must be a 32-byte hex private key");
  }
  return normalized;
}

const deploymentNetworks = {};
if (process.env.INFURA_PROJECT_ID && process.env.PRIVATE_KEY) {
  deploymentNetworks.sepolia = {
    url: rpcUrl("sepolia", "INFURA_PROJECT_ID", "https://sepolia.infura.io/v3/{id}"),
    accounts: [privateKey()],
    gasPrice: 20000000000,
  };
  deploymentNetworks.mainnet = {
    url: rpcUrl("mainnet", "INFURA_PROJECT_ID", "https://mainnet.infura.io/v3/{id}"),
    accounts: [privateKey()],
    gasPrice: 20000000000,
  };
  deploymentNetworks.polygon = {
    url: rpcUrl("polygon", "INFURA_PROJECT_ID", "https://polygon-mainnet.infura.io/v3/{id}"),
    accounts: [privateKey()],
  };
}

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    localhost: { url: "http://127.0.0.1:8545" },
    ...deploymentNetworks,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
};
