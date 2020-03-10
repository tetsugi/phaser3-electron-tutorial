import { app, BrowserWindow } from "electron"
import path from "path"

let window: BrowserWindow

const createWindow = () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
  })

  window.loadFile(path.resolve(__dirname, "index.html"))

  window.on("closed", () => {
    window = null
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (window == null) createWindow()
})
