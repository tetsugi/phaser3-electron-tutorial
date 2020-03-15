import { Configuration, DefinePlugin, Compiler } from "webpack"
import merge from "webpack-merge"
import path from "path"
import HtmlPlugin from "html-webpack-plugin"
import { server as electronConnect } from "electron-connect"

const { NODE_ENV } = process.env
const isDev = NODE_ENV === "development"

const server = isDev ? electronConnect.create({
  path: path.join(__dirname, "dist", "main.js"),
  logLevel: 0,
  stopOnClose: true,
}) : {}

const ConnectPlugin = (isMain = true) => {
  let isStarted = false

  return {
    apply(compiler: Compiler) {
      compiler.hooks.done.tap("ConnectPlugin", () => {
        if (isStarted) {
          server[isMain ? "restart" : "reload"]()
        } else {
          if (isMain) server.start()
          isStarted = true
        }
      })
    },
  }
}

const common: Configuration = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "source-map" : false,
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "@": path.join(__dirname, "src"),
      "@@": __dirname,
    },
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      NODE_ENV,
    }),
  ],
}

const main: Configuration = merge(common, {
  target: "electron-main",
  entry: path.resolve(__dirname, "src", "main", "index.ts"),
  output: {
    filename: "main.js",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    ...(isDev ? [
      ConnectPlugin(),
    ] : []),
  ],
})

const renderer: Configuration = merge(common, {
  target: "web",
  entry: path.resolve(__dirname, "src", "renderer", "index.ts"),
  output: {
    filename: "renderer.js",
  },
  resolve: {
    extensions: [".json", ".css"],
    alias: {
      "@assets": path.join(__dirname, "src", "renderer", "assets"),
    },
  },
  module: {
    rules: [
      {
        test:  /\.(png|woff|woff2|eot|ttf|svg|fnt)$/,
        loader: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      title: "Phaser3 Tutorial Game",
      filename: "index.html",
      template: path.resolve(__dirname, "template", "index.html"),
    }),
    ...(isDev ? [
      ConnectPlugin(false),
    ] : []),
  ],
})

export default [renderer, main]
