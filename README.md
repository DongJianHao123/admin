## Environment

- node 16.10.0

## Start

1. yarn
2. yarn start

## build

```
yarn build
```

## 运行打包文件

建议使用 `yarn serve` 启动，内置 gzip 压缩，访问时可减小包的体积，加快访问速度。

## deploy

使用 github 工作流，当代码提交到 main 分支上时，会自动构建打包，然后将打包后的文件发送的服务器，重启部署的服务，详情见 `.github/workflows/deploy.yml`文件
