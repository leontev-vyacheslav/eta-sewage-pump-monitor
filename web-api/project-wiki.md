### 1. I need to test my react application on a mobile phone using the  Wi-fi network. How can I do this? My developer PC has 192.168.0.200 ip address. I forgot to tell you that I do my work on WSL under Windows 11

```shell
HOST=0.0.0.0 npm start

netsh interface portproxy add v4tov4 listenaddress=192.168.0.200 listenport=3000 connectaddress=127.0.0.1 connectport=3000
netsh interface portproxy add v4tov4 listenaddress=192.168.0.200 listenport=5000 connectaddress=127.0.0.1 connectport=5000
```