# Homebridge-snapcast

`homebridge-snapcast` is a Homebridge plugin for controlling Snapcast clients. HomeKit has an official Service.Speaker but Apple hasn't implamented this service in the Home App so the workaround is to use Service.Lightbulb and use the brightness to control the volume.

### Install:
```bash
npm install -g homebridge-snapcast
```

### Example plugin configuration:
```json
{
    "accessory":"Snapcast",
    "name":"Bathroom",
    "groupname":"Whole Home",
    "serverUrl":"http://localhost:1780/jsonrpc"
}
```

### Option Descriptions:

```
name        : <string> name of the snapcast client (Ex: Bathroom)
groupname   : <string> name of the group that the snapcast client is located (Ex: Whole Home)
groupnumber : <integer> group number that the snapcast client is located (Use groupname or groupnumber but not both)
serverUrl   : <string> URL to Snapcast JSON-RPC server (Ex: http://localhost:1780/jsonrpc)
```

![](https://i.imgur.com/xalWqIw.png)
