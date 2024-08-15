export interface IIpcHeader {
    compress: boolean
}

export class IpcHeader {
    constructor(public compress: boolean) {
        this.compress = compress
    }

    public static from(data: IIpcHeader) {
        return new IpcHeader(data.compress)
    }

    public data() {
        return { compress: this.compress }
    }
}
