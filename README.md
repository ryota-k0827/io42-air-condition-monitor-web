# io42-air-condition-monitor-web

## 概要
- HAL IO42 後期評定課題
- 温湿度センサーで取得したデータをWebSocketを用いて、バックエンドから受け取り表示します。
- 取得したデータはjson形式で記録されているため、過去のデータも閲覧可能。

## 環境
- Raspberry Pi 3 Model B
- DHT11 温湿度モジュール

```console
$ python -V
Python 3.9.2

$ lsb_release -a
No LSB modules are available.
Distributor ID: Raspbian
Description:    Raspbian GNU/Linux 11 (bullseye)
Release:        11
Codename:       bullseye
```

## セットアップ

### nginxをインストール
```console
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install nginx
```

### ラズパイにリポジトリをクローン
```console
$ cd $HOME/html
$ git clone git@github.com:ryota-k0827/io42-air-condition-monitor-web.git
```

### アクセス（クライアント端末から）
```console
open http://{ラズパイのipアドレス}/io42-air-condition-monitor-web/
```
