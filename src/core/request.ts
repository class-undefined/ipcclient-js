import { IIpcHeader, IpcHeader } from "./header"

export interface IIpcRequest {
    id: string
    clientId: string
    path: string
    header: IIpcHeader
    body: unknown
}

export class IpcRequest {
    constructor(
        public id: string,
        public clientId: string,
        public path: string,
        public header: IpcHeader,
        public body: any
    ) {
        this.id = id
        this.clientId = clientId
        this.path = path
        this.header = header
        this.body = body
    }

    public static from(request: IIpcRequest) {
        return new IpcRequest(
            request.id,
            request.clientId,
            request.path,
            IpcHeader.from(request.header),
            request.body
        )
    }

    public data() {
        return {
            id: this.id,
            clientId: this.clientId,
            path: this.path,
            header: this.header.data(),
            body: this.body,
        }
    }
}
