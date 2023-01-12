/**
 * @name DCCon
 * @description Plugin who help DCCon easler use discord
 * @version 2.0.0
 * @author yejun
 * @authorId 310247242546151434
 * @source https://github.com/minibox24/DCCon
 * @invite pbd2xXJ
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    main: "index.js",
    name: "DCCon",
    author: "yejun",
    authorId: "310247242546151434",
    version: "2.0.0",
    description: "Plugin who help DCCon easler use discord",
    source: "https://github.com/minibox24/DCCon",
    github_raw: "https://raw.githubusercontent.com/minibox24/DCCon/v2/release/DCCon.plugin.js",
    invite: "pbd2xXJ",
    changelog: [],
    defaultConfig: []
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Library) => {
  const TestComponent = (() => {
  const [count, setCount] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "red",
      width: "100px",
      height: "100px"
    }
  }, /*#__PURE__*/React.createElement("div", null, count), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setCount(x => x + 1);
    }
  }, "click me"));
});
  const {
    WebpackModules,
    ReactComponents,
    ContextMenu,
    Utilities,
    ColorConverter,
    Toasts,
    Modals,
    Tooltip,
    DOMTools,
    ReactTools,
    Logger,
    DiscordModules: {
      React,
      ElectronModule,
      Dispatcher,
      LocaleManager,
      SelectedChannelStore,
      ChannelStore,
      UserStore,
      Permissions,
      Strings
    },
    Patcher
  } = Library;
  const BdApi = new window.BdApi("DCCon");
  const {
    Webpack
  } = BdApi;
  const PermissionsConstants = Webpack.getModule(Webpack.Filters.byProps("ADD_REACTIONS"), {
    searchExports: true
  });
  let ChannelTextAreaButtons;

  // https://github.com/Strencher/BetterDiscordStuff/blob/master/InvisibleTyping/InvisibleTyping.plugin.js#L483-L494
  function loadChannelTextAreaButtons() {
    const buttonsClassName = WebpackModules.getByProps("profileBioInput", "buttons")?.buttons;
    const vnode = ReactTools.getReactInstance(document.querySelector(`.${buttonsClassName}`));
    if (!vnode) return;
    for (let curr = vnode, max = 100; curr !== null && max--; curr = curr.return) {
      const tree = curr?.pendingProps?.children;
      let buttons;
      if (Array.isArray(tree) && (buttons = tree.find(s => s?.props?.type && s.props.channel && s.type?.$$typeof))) {
        ChannelTextAreaButtons = buttons.type;
        return;
      }
    }
  }
  return class extends Plugin {
    onStart() {
      Logger.info("Plugin enabled!");
      this.patchChannelTextArea();
    }
    onStop() {
      Logger.info("Plugin disabled!");
    }
    patchChannelTextArea() {
      loadChannelTextAreaButtons();
      if (ChannelTextAreaButtons == null) return;
      Patcher.after(ChannelTextAreaButtons, "type", (_, __, returnValue) => {
        if (Utilities.getNestedProp(returnValue, "props.children.1.props.type") === "sidebar") return;
        const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
        const perms = Permissions.can({
          permission: PermissionsConstants.SEND_MESSAGES,
          user: UserStore.getCurrentUser(),
          context: channel
        });
        if (!channel.type && !perms) return;
        const buttons = returnValue.props.children;
        if (!buttons || !Array.isArray(buttons)) return;
        buttons.push(TestComponent());
        Logger.log(buttons);
      });
    }
  };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/