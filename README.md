# three-vr

```
bun install
bun server
bun dev
```

## links

https://note.com/npaka/n/n2b871e80f95d

https://discourse.threejs.org/t/how-to-enable-webxr-passthrough-for-quest2/43897

https://www.oculus.com/casting

https://www.oculus.com/url/?url=https%3A%2F%2F172.21.67.146%3A5173%2F&ext=1713320585&hash=AeTWQUra-Lli_wsqD5I

https://ich1q.one/works/63/

https://app.quicktype.io/

https://immersive-web.github.io/webxr-samples/

## ngrok

```sh
ngrok start --all
```

https://qiita.com/MS-0610/items/8334bd1c165ea63ae566

```yml
# ngrok.yml
tunnels:
  client:
    addr: 5173
    proto: http
  wss:
    addr: 3000
    proto: http
```

## key

```
openssl genrsa -out key.pem && openssl req -new -key key.pem -out csr.pem && openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```
