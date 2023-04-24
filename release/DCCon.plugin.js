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
  // #region imports

  const ManduIcon = (props => {
  const size = props.size || "24px";
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 512 512",
    className: classes.icon.icon,
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("path", {
    transform: "translate(0,512) scale(0.1,-0.1)",
    fill: "currentColor",
    d: "M2490 4778 c-142 -20 -270 -116 -332 -248 -30 -65 -35 -70 -58 -65 -60 14 -195 17 -249 5 -179 -39 -278 -147 -360 -391 -26 -79 -30 -85 -72 -108 -341 -182 -501 -295 -723 -511 -340 -331 -569 -722 -654 -1120 -91 -420 -29 -784 190 -1112 74 -111 257 -298 373 -380 480 -339 1130 -509 1955 -509 733 0 1322 133 1785 401 148 86 244 159 365 280 169 167 278 341 344 545 119 368 71 803 -133 1220 -126 255 -278 462 -497 675 -222 216 -383 329 -723 511 -44 23 -45 26 -82 137 -21 63 -50 134 -65 159 -53 91 -150 164 -263 199 -56 18 -182 19 -245 3 -26 -6 -48 -10 -49 -8 -2 2 -18 35 -36 72 -61 126 -192 226 -316 242 -27 3 -59 7 -70 9 -11 2 -49 -1 -85 -6z m-470 -1163 c62 -32 92 -105 72 -174 -17 -55 -364 -396 -409 -403 -111 -16 -198 72 -178 179 6 32 32 64 173 207 92 92 181 177 197 187 36 23 105 25 145 4z m621 -8 c64 -42 70 -68 67 -284 -3 -177 -5 -194 -24 -220 -47 -63 -132 -84 -195 -47 -70 41 -74 54 -77 267 -2 168 0 196 15 227 26 50 76 80 133 80 32 0 58 -7 81 -23z m597 9 c15 -8 104 -92 199 -188 187 -189 198 -207 174 -288 -13 -45 -69 -96 -112 -102 -74 -11 -86 -4 -276 185 -192 189 -211 216 -200 284 8 46 30 79 70 103 38 24 106 26 145 6z"
  }));
});
  const DCConButton = (() => {
  const [active, setActive] = React.useState(false);
  const changeActive = ({
    active
  }) => {
    setActive(active);
  };
  React.useEffect(() => {
    Dispatcher.subscribe("DCCON_CALL", changeActive);
    return () => {
      Dispatcher.unsubscribe("DCCON_CALL", changeActive);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: classes.textarea.buttonContainer
  }, /*#__PURE__*/React.createElement("button", {
    className: `${classes.look.button} ${classes.look.lookBlank} ${classes.look.colorBrand} ${classes.look.grow}`,
    tabIndex: "0",
    onClick: () => {
      Dispatcher.dispatch({
        type: "DCCON_CALL",
        active: !active
      });
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `${classes.look.contents} ${classes.textarea.button} ${classes.icon.button}`,
    style: active ? {
      color: "white"
    } : null
  }, /*#__PURE__*/React.createElement("div", {
    className: `${classes.icon.buttonWrapper}`,
    style: {
      opacity: "1",
      transform: "none"
    }
  }, /*#__PURE__*/React.createElement(ManduIcon, null)))));
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
  const ExpressionPicker = {};

  // #endregion

  // #region styles

  const classModules = {
    icon: WebpackModules.getByProps("hoverScale", "buttonWrapper", "button"),
    menu: WebpackModules.getByProps("menu", "scroller", "colorDefault"),
    result: WebpackModules.getByProps("desiredItemWidth", "results", "result"),
    input: WebpackModules.getByProps("inputWrapper", "input", "focused"),
    role: WebpackModules.getByProps("roleCircle"),
    _gif: WebpackModules.getByProps("container", "gifFavoriteButton", "embedWrapper"),
    gif: WebpackModules.getByProps("size", "gifFavoriteButton", "selected"),
    image: WebpackModules.getByProps("flexCenter", "imageWrapper", "imageWrapperBackground"),
    control: WebpackModules.getByProps("container", "labelRow", "control"),
    category: WebpackModules.getByProps("container", "categoryFade", "categoryFadeBlurple"),
    textarea: WebpackModules.getByProps("textAreaHeight", "channelTextArea", "highlighted"),
    gutter: WebpackModules.getByProps("gutterSize", "container", "content"),
    _flex: WebpackModules.getByProps("_flex", "_horizontal", "_horizontalReverse"),
    flex: WebpackModules.getByProps("flex", "alignStart", "alignEnd"),
    color: WebpackModules.getByProps("selectable", "strong", "colorStandard"),
    size: WebpackModules.getByProps("size10", "size12", "size14"),
    title: WebpackModules.getByProps("title", "h1", "h2"),
    container: WebpackModules.getByProps("container", "inner", "pointer"),
    scroller: WebpackModules.getByProps("scrollerBase", "thin", "fade"),
    look: WebpackModules.getByProps("lowSaturationUnderline", "button", "lookFilled"),
    audio: WebpackModules.getByProps("wrapper", "wrapperAudio", "wrapperPaused")
  };
  const classes = {
    icon: {
      icon: classModules.icon.icon,
      active: classModules.icon.active,
      button: classModules.icon.button,
      buttonWrapper: classModules.icon.buttonWrapper
    },
    menu: {
      item: classModules.menu.item,
      labelContainer: classModules.menu.labelContainer,
      label: classModules.menu.label,
      colorDefault: classModules.menu.colorDefault,
      focused: classModules.menu.focused
    },
    result: {
      result: classModules.result.result,
      favButton: classModules.result.favButton,
      emptyHints: classModules.result.emptyHints,
      emptyHint: classModules.result.emptyHint,
      emptyHintCard: classModules.result.emptyHintCard,
      emptyHintFavorite: classModules.result.emptyHintFavorite,
      emptyHintText: classModules.result.emptyHintText,
      gif: classModules.result.gif,
      endContainer: classModules.result.endContainer
    },
    input: {
      inputDefault: classModules.input.inputDefault,
      inputWrapper: classModules.input.inputWrapper
    },
    roleCircle: classModules.role.roleCircle,
    gif: {
      gifFavoriteButton1: classModules._gif.gifFavoriteButton,
      size: classModules.gif.size,
      gifFavoriteButton2: classModules.gif.gifFavoriteButton,
      selected: classModules.gif.selected,
      showPulse: classModules.gif.showPulse,
      icon: classModules.gif.icon
    },
    image: {
      imageAccessory: classModules.image.imageAccessory,
      clickable: classModules.image.clickable,
      embedWrapper: classModules._gif.embedWrapper,
      imageWrapper: classModules.image.imageWrapper
    },
    control: classModules.control.control,
    category: {
      categoryFade: classModules.category.categoryFade,
      categoryText: classModules.category.categoryText,
      categoryName: classModules.category.categoryName,
      categoryIcon: classModules.category.categoryIcon,
      container: classModules.category.container
    },
    textarea: {
      textAreaSlate: classModules.textarea.textAreaSlate,
      buttonContainer: classModules.textarea.buttonContainer,
      button: classModules.textarea.button
    },
    gutter: {
      header: classModules.gutter.header,
      backButton: classModules.gutter.backButton,
      searchHeader: classModules.gutter.searchHeader,
      searchBar: classModules.gutter.searchBar,
      content: classModules.gutter.content,
      container: classModules.gutter.container
    },
    flex: {
      flex: classModules._flex.flex,
      horizontal: classModules._flex.horizontal,
      justifyStart: classModules.flex.justifyStart,
      alignCenter: classModules.flex.alignCenter,
      noWrap: classModules.flex.noWrap
    },
    colorStandard: classModules.color.colorStandard,
    size14: classModules.size.size14,
    h5: classModules.title.h5,
    container: {
      container: classModules.container.container,
      medium: classModules.container.medium,
      inner: classModules.container.inner,
      input: classModules.container.input,
      iconLayout: classModules.container.iconLayout,
      iconContainer: classModules.container.iconContainer,
      pointer: classModules.container.pointer,
      clear: classModules.container.clear,
      visible: classModules.container.visible
    },
    scroller: {
      thin: classModules.scroller.thin,
      scrollerBase: classModules.scroller.scrollerBase,
      fade: classModules.scroller.fade,
      content: classModules.scroller.content
    },
    look: {
      button: classModules.look.button,
      lookBlank: classModules.look.lookBlank,
      colorBrand: classModules.look.colorBrand,
      grow: classModules.look.grow,
      contents: classModules.look.contents
    },
    audio: {
      wrapperAudio: classModules.audio.wrapperAudio
    }
  };

  // #endregion

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
  function loadExpressionPicker() {
    const modules = Webpack.getModule(m => Object.keys(m).some(key => m[key]?.toString?.().includes("isSearchSuggestion")));
    if (modules == null) return;
    Object.values(modules).forEach(fn => {
      const code = String(fn);
      if (code.includes("useDebugValue") && fn.getState) {
        ExpressionPicker.useExpressionPickerStore = fn;
      } else if (code.includes("===")) {
        ExpressionPicker.toggleExpressionPicker = fn;
      } else if (code.includes("activeView:null,activeViewType:null")) {
        ExpressionPicker.closeExpressionPicker = fn;
      }
    });
  }
  function loadModules() {
    loadChannelTextAreaButtons();
    // loadExpressionPicker();
  }

  return class extends Plugin {
    onStart() {
      Logger.info("Plugin enabled!");
      loadModules();
      this.patchChannelTextArea();
    }
    onStop() {
      Patcher.unpatchAll();
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
        buttons.push(React.createElement(DCConButton));
      });
    }
  };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/