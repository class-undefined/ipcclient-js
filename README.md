# ipcclient-js

This is a simple IPC client for JavaScript. It is designed to work with the IPC server in the [ipcserver](https://github.com/class-undefined/ipcserver.git)

## Usage

```typescript

import { IpcClient } from 'ipcclient';

IpcClient.connect('/path/to/foo.sock', async (client) => {
    const response = await client.send<string>("/hello", 'Hello, World!')
    console.log(response) // IpcResponse<string> { data: 'Hello, World!', code: 200, message: '处理成功' }
});

```



## Handling `Error: crypto.getRandomValues() not supported on node.js`

If you encounter the error `Error: crypto.getRandomValues() not supported on node.js` while running your Node.js application, it indicates that the `crypto.getRandomValues()` method is not available in your current Node.js environment.

To resolve this issue, you can install the `polyfill-crypto-methods` package, which provides a polyfill for the `crypto.getRandomValues()` method.

### Steps to Install the Polyfill

1. **Install the `polyfill-crypto-methods` package** using npm or yarn:

   ```bash
   npm install polyfill-crypto-methods
   ```

2. Import and apply the polyfill in your code before you use any functionality that requires the `crypto.getRandomValues()` method:

   ```javascript
   import 'polyfill-crypto-methods'
   ```