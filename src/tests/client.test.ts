import { IpcClient } from "../core"
test("", (done) => {
    const sock = "/tmp/ipcserver.sock"
    IpcClient.connect(sock).then(async (client) => {
        client.on("/msg", (res) => {
            console.log(1, res)
        })
        let response = await client.send("/virtuoso/run", "hello")
        console.log(response.data)
        response = await client.send("/virtuoso/stop", "hello")
        console.log(response.data)
        response = await client.send("/virtuoso/clients", "hello")
        console.log(response.data)
        done()
    })
})
