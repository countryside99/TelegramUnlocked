# TelegramUnlocked

一个隐形、轻量级的客户端隐私修改工具，用于 Telegram Web K，同时绕过部分限制。自动启用幽灵模式（Ghost Mode）、解锁受保护的频道，并冻结“正在输入”状态。

# 支持的浏览器

* Google Chrome / 基于 Chromium 的浏览器（请参阅 **main** 分支）
* Firefox（请参阅 **mozilla-firefox** 分支）

# 使用方法

* 检查你的浏览器是否在支持的浏览器列表中。如果不在，请提交一个 Issue。
* 克隆或下载此仓库。

## 安装

### Google Chrome（或基于 Chromium 的浏览器）

1. 克隆或下载此仓库，如有需要请先解压。
2. 打开 `chrome://extensions/`。
3. 启用**开发者模式**（右上角）。
4. 点击**加载已解压的扩展程序**。
5. 选择包含扩展文件的项目文件夹。
6. 此扩展程序现在应该会出现在浏览器中，并可以使用。

### Mozilla Firefox

1. 克隆或下载此仓库的 **Firefox** 分支。
2. 打开 `about:debugging#/runtime/this-firefox`。
3. 点击**临时加载附加组件……**。
4. 选择扩展程序的 `manifest.json` 文件。
5. 扩展程序将在 Firefox 重启前保持加载状态。

## 更新

如果你从仓库中拉取了新的更改：

* 在浏览器的扩展程序页面中重新加载该扩展程序。
* 如有必要，先移除该扩展程序，然后重新加载。

## 故障排除

* 确保已启用**开发者模式**（Chrome/Chromium）。
* 确保你为所使用的浏览器选择了正确的**分支**。
* 如果扩展程序无法加载，请检查浏览器的扩展程序错误日志，以获取更多详细信息。

# 许可证声明

整个软件及其仓库均采用 **GNU General Public License 3.0（GNU GPL v3.0）** 授权。详情请参阅 `LICENSE` 文件。
