import Net from "node:net"
import { encode } from "msgpack-lite"
import { IpcResponse } from "./response"
import { v4 as uuid } from "uuid"
import { IpcRequest } from "./request"
import "polyfill-crypto-methods"
export class IpcClient {
    private client: Net.Socket
    private id: string = uuid()
    private listeners: Map<string, ((data: Uint8Array) => void)[]> = new Map()
    private constructor(client: Net.Socket) {
        this.client = client
        this.client.setMaxListeners(200)
    }

    static async connect(sock: string) {
        return new Promise<IpcClient>((resolve, reject) => {
            const client = Net.createConnection({ path: sock }, () => {
                const ipc = new IpcClient(client)
                resolve(ipc)
            })
            client.addListener("error", reject)
        })
    }

    public getClientId() {
        return this.id
    }

    /**
     * 向指定路由发送数据并接收反馈
     * @param path 路由路径
     * @param data 欲发送数据
     * @returns `Promise<IpcResponse<T>>`
     */
    async send<T>(path: string, data: any) {
        let listener: null | ((data: Uint8Array) => void) = null
        let errorListener: null | ((err: Error) => void) = null
        let closeListener: null | (() => void) = null
        return new Promise<IpcResponse<T>>((resolve, reject) => {
            const header = { compress: false }
            const request = IpcRequest.from({
                id: uuid(),
                clientId: this.id,
                path,
                header,
                body: data,
            })
            const bufferBody = encode(request.data())
            const size = bufferBody.length
            const buffer = new Uint8Array(8 + size)
            const view = new DataView(buffer.buffer)

            // 设置8字节长度前缀（大端序）
            view.setBigUint64(0, BigInt(size), false)
            buffer.set(bufferBody, 8)
            listener = (d: Uint8Array) => {
                const [req, response] = IpcResponse.fromBuffer<T>(d)
                if (req.id !== request.id) return
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
                if (response.isError()) return Promise.reject(new Error(response.message))
                return response
            })
            .finally(() => {
                if (listener) this.client.removeListener("data", listener)
                if (errorListener) this.client.removeListener("error", errorListener)
                if (closeListener) this.client.removeListener("close", closeListener)
            })
    }

    public on<T>(path: string, listener: (response: IpcResponse<T>) => void) {
        const cb = (buffer: Uint8Array) => {
            const [request, response] = IpcResponse.fromBuffer(buffer)
            if (request.path === path) listener(response as IpcResponse<T>)
        }
        this.client.addListener("data", cb)
    }

    // 为了实现装饰器，将IpcListener方法提取到IpcClient类中
    public IpcListener<T>(path: string) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const originalMethod = descriptor.value

            descriptor.value = (...args: any[]) => {
                const cb = (buffer: Uint8Array) => {
                    const [request, response] = IpcResponse.fromBuffer(buffer)
                    if (request.path === path) {
                        originalMethod.call(this, response as IpcResponse<T>)
                    }
                }
                this.client.addListener("data", cb)
            }

            return descriptor
        }
    }
}
