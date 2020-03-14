import { Configuration } from "webpack"
import merge from "webpack-merge"
import path from "path"
import HtmlPlugin from "html-webpack-plugin"

const isDev = process.env.NODE_ENV === "development"
const mode = isDev ? "development" : "production"

const outputPath = path.resolve(__dirname, "dist")

const common: Configuration = {
  mode,
  devtool: isDev ? "source-map" : false,
  output: {
    path: outputPath,
    filename: "main.js",
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
  ],
})

export default [main, renderer]
