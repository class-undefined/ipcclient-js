# ipcclient-javascript

This is a simple IPC client for JavaScript. It is designed to work with the IPC server in the [ipcserver](https://github.com/class-undefined/ipcserver.git)

## Usage

```typescript

import { IPCClient } from 'ipcclient';

IpcClient.connect('/path/to/foo.sock', async (client) => {
    const response = await client.send<string>("/hello", 'Hello, World!')
    console.log(response) // IpcResponse<string> { data: 'Hello, World!', code: 200, message: '处理成功' }
});

```