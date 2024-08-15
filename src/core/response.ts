import { decode } from "msgpack-lite"
import { IIpcRequest, IpcRequest } from "./request"
export enum IpcStatus {
    OK = 200,
    CACHED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
}

export class IpcResponse<T> {
    constructor(public message: string, public code: IpcStatus, public data: T) {
        this.code = code
        this.message = message
        this.data = data
    }

    public static fromBuffer<T>(buffer: Uint8Array): [IpcRequest, IpcResponse<T>] {
        const [request, { message, code, data }] = decode(buffer) as [
            IIpcRequest,
            {
                message: string
                code: IpcStatus
                data: T
            }
        ]
        return [IpcRequest.from(request), new IpcResponse(message, code, data)]
    }

    public isError(): boolean {
        return this.code >= 400
    }
}
