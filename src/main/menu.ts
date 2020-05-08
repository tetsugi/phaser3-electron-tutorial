import { Menu } from "electron"

const isMac = process.platform === "darwin"
const isDev = process.env.NODE_ENV === "development"

export default Menu.buildFromTemplate([
  {
    label: "アプリ",
    submenu: [
      {
        label: "リセット",
        role: "reload",
      },
      isMac
        ? {
          label: "閉じる",
          role: "close",
        }
        : {
          label: "終了",
          role: "quit",
        },
    ],
  },
  ...(
    isDev ? [
      {
        label: "デバッグ",
        submenu: [
          { role: "forceReload" },
          { role: "toggleDevTools" },
        ],
      },
    ] : [] as any),
])
