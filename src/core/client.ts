import Net from "node:net"
import { encode } from "msgpack-lite"
import { IpcResponse } from "./response"
import { v4 as uuid } from "uuid"
export class IpcClient {
    private client: Net.Socket
    private constructor(client: Net.Socket) {
        this.client = client
        this.client.setMaxListeners(200)
    }

    static async connect(sock: string) {
        return new Promise<IpcClient>((resolve, reject) => {
            const client = Net.createConnection({ path: sock }, () => {
                resolve(new IpcClient(client))
            })
            client.addListener("error", reject)
        })
    }

    async send<T>(path: string, data: any) {
        let listener: null | ((data: Uint8Array) => void) = null
        let errorListener: null | ((err: Error) => void) = null
        let closeListener: null | (() => void) = null
        return new Promise<IpcResponse<T>>((resolve, reject) => {
            const requestId = uuid()
            const bufferBody = encode([path, { compress: false, id: requestId }, data])
            const size = bufferBody.length
            const buffer = new Uint8Array(8 + size)
            const view = new DataView(buffer.buffer)

            // 设置8字节长度前缀（大端序）
            view.setBigUint64(0, BigInt(size), false)
            buffer.set(bufferBody, 8)
            listener = (d: Uint8Array) => {
                const [id, response] = IpcResponse.fromBuffer<T>(d)
                if (id !== requestId) return
                resolve(response)
            }
            errorListener = (err: Error) => reject(new Error(`Client error: ${err.message}`))
            closeListener = () => reject(new Error("Client connection closed unexpectedly"))
            this.client.addListener("data", listener)
            this.client.addListener("error", errorListener)
            this.client.addListener("close", closeListener)
            this.client.write(buffer)
        })
            .then((response) => {
                if (response.isError()) throw new Error(response.message)
                return response
            })
            .finally(() => {
                if (listener) this.client.removeListener("data", listener)
                if (errorListener) this.client.removeListener("error", errorListener)
                if (closeListener) this.client.removeListener("close", closeListener)
            })
    }
}
