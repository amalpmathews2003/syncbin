# SyncBin

SyncBin is a collaborative code editor with real-time synchronization and QR code sharing. It allows multiple users to edit code simultaneously and share the session using a QR code.

## Features

- Real-time collaborative code editing
- Language selection
- File selection
- Dark mode support
- QR code sharing for easy session access
- Editable toggle for session control

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/syncbin.git
   cd syncbin
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   NEXT_PUBLIC_URL=http://localhost:3000
   NEXT_PUBLIC_PARTYKIT_URL=ws://localhost:1999
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   npx partykit dev
   # or
   yarn dev
   yarn partykit dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Use the editor to write and edit code.
- Select the programming language using the language selector.
- Choose files using the file selector.
- Share the session by scanning the QR code.
- Toggle editability using the edit toggler.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Partysocket](https://github.com/partysocket/partysocket)
- [QRCode.react](https://github.com/zpao/qrcode.react)
