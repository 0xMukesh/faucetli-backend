# 🦄 faucetli-backend

This repository contains the backend of the faucetli command line tool.

🎉 Core repository: https://github.com/kira272921/faucetli

## 🤝 Contributing

All kinds of contributions are welcome. Please open an issue if you have any ideas or faced any kind of bug.

To setup the local developer environment, please run the following steps:

1. Install all the dependencies:

   ```bash
   yarn
   ```

1. Build the source code:

   ```bash
   yarn build
   ```

1. Create a new wallet in metamask and add it's private key in `.env` file.

1. Head over to [Alchemy](https://www.alchemy.com/) and create two new projects, one for rinkeby and one for mumbai and store their API urls in `.env` file.

1. Run the development server:

   ```bash
   yarn dev
   ```
