/**
 * @name DCCon
 * @invite pbd2xXJ
 * @website https://github.com/minibox24/DCCon
 * @source https://raw.githubusercontent.com/minibox24/DCCon/main/DCCon.plugin.js
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

module.exports = (() => {
    const config = {"info":{"name":"DCCon","authors":[{"name":"yejun","discord_id":"310247242546151434","github_username":"minibox24"}],"inviteCode":"pbd2xXJ","version":"1.2.2","description":"Plugin who help DCCon easler use discord","github":"https://github.com/minibox24/DCCon","github_raw":"https://raw.githubusercontent.com/minibox24/DCCon/main/DCCon.plugin.js"},"changelog":[{"title":"버그 패치","items":["디시콘이 보내지지 않는 빅 버그를 수정하였습니다"]},{"title":"English","type":"progress","items":["edit bug"]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
  const {
    Logger,
    Patcher,
    WebpackModules,
    Utilities,
    PluginUtilities,
    PluginUpdater,
    Modals,
    DiscordModules,
    DiscordModules: { React, SelectedChannelStore, UserSettingsStore, UserStore, ChannelStore, Dispatcher, Permissions, ReactDOM },
  } = Library;

  const DCConBaseURL = "https://dcimg5.dcinside.com/dccon.php?no=";
  const { saveData, loadData } = window.BdApi;
  const request = require("request");

  const ChannelTextAreaButtons = WebpackModules.getModule((m) => m.type?.displayName === "ChannelTextAreaButtons");
  const { toggleExpressionPicker, closeExpressionPicker } = WebpackModules.getByProps("toggleExpressionPicker");
  const toggleExpressionPickerParam = WebpackModules.getByProps("ChatInputTypes").ChatInputTypes.NORMAL;
  const ExpressionPicker = WebpackModules.getModule((e) => e.type?.displayName === "ExpressionPicker");
  const PermissionsConstants = WebpackModules.getByProps("Permissions", "ActivityTypes").Permissions;
  const toggleDCCon = () => toggleExpressionPicker("dccon", toggleExpressionPickerParam);
  const { ScrollerAuto: Scroller } = WebpackModules.getByProps("ScrollerAuto");

  const texts = ((locale) => {
  switch (locale) {
    case "ko":
      return {
        tabName: {
          dccon: "디시콘",
          mydccon: "내 디시콘",
          shop: "디시콘샵",
          setting: "설정",
        },
        button: {
          remove: "제거",
          save: "저장",
        },
        setting: {
          button: "버튼",
          data: "데이터",
          info: "정보",
          btnText: "디시콘 버튼",
          saved: "저장된 디시콘: {0}개 (총 {1}개)",
        },
        modal: {
          dataTitle: "모든 데이터 초기화",
          dataDesc: "정말로 모든 디시콘 플러그인 데이터를 초기화할까요?",
          recentTitle: "최근 사용 초기화",
          recentDesc: "정말로 디시콘 최근 사용 기록을 초기화할까요?",
        },
        searchPlaceholder: "디시콘 검색하기",
        recent: "최근 사용",
        conCount: "{0}개의 디시콘",
        blankPage: "플러그인 설정에서 디시콘을 추가해보세요!",
      };
    default:
      return {
        tabName: {
          dccon: "DCCon",
          mydccon: "My DCCon",
          shop: "DCCon Shop",
          setting: "Setting",
        },
        button: {
          remove: "Remove",
          save: "Save",
        },
        setting: {
          button: "Button",
          data: "Data",
          info: "Info",
          btnText: "DCCon Button",
          saved: "Saved DCCon: {0} (Total {1})",
        },
        modal: {
          dataTitle: "Reset All Data",
          dataDesc: "Are you really going to reset all DCCon datas?",
          recentTitle: "Reset Recently Used Data",
          recentDesc: "Are you really going to reset recetly used DCCon datas?",
        },
        searchPlaceholder: "Search DCCon",
        recent: "Recently used",
        conCount: "{0} DCCon",
        blankPage: "Add DCCon on Plugin Setting",
      };
  }
})(UserSettingsStore.locale);
  const thumbCache = {};

  const class_modules = {
    gutter: WebpackModules.getByProps("gutterSize", "container", "content"),
    _flex: WebpackModules.getByProps("_flex", "_horizontal", "_horizontalReverse"),
    flex: WebpackModules.getByProps("flex", "alignStart", "alignEnd"),
    container: WebpackModules.getByProps("container", "inner", "pointer"),
    icon: WebpackModules.getByProps("hoverScale", "buttonWrapper", "button"),
    title: WebpackModules.getByProps("title", "h1", "h2"),
    button: WebpackModules.getByProps("borderBrand", "colorBrand", "transitionDuration"),
    nav: WebpackModules.getByProps("nav", "navButton", "navItem"),
    divider1: WebpackModules.getAllByProps("divider").filter((x) => Object.keys(x).length == 1)[1],
    divider2: WebpackModules.getByProps("dividerDefault"),
    look: WebpackModules.getByProps("lowSaturationUnderline", "button", "lookFilled"),
    textarea: WebpackModules.getByProps("textAreaHeight", "channelTextArea", "highlighted"),
  };

  const classes = {
    gutter: {
      header: class_modules.gutter.header,
      backButton: class_modules.gutter.backButton,
      searchHeader: class_modules.gutter.searchHeader,
      searchBar: class_modules.gutter.searchBar,
      content: class_modules.gutter.content,
      container: class_modules.gutter.container,
    },
    flex: {
      flex: class_modules._flex.flex,
      horizontal: class_modules._flex.horizontal,
      justifyStart: class_modules.flex.justifyStart,
      alignCenter: class_modules.flex.alignCenter,
      noWrap: class_modules.flex.noWrap,
    },
    container: {
      container: class_modules.container.container,
      medium: class_modules.container.medium,
      inner: class_modules.container.inner,
      input: class_modules.container.input,
      iconLayout: class_modules.container.iconLayout,
      iconContainer: class_modules.container.iconContainer,
      pointer: class_modules.container.pointer,
      clear: class_modules.container.clear,
      visible: class_modules.container.visible,
    },
    search: {
      icon: class_modules.icon.icon,
      visible: class_modules.icon.visible,
    },
    text: {
      h1: class_modules.title.h1,
      h5: class_modules.title.h5,
      defaultColor: class_modules.title.defaultColor,
    },
    button: {
      button: class_modules.button.button,
      color: class_modules.button.colorBrand,
      looks: class_modules.button.lookFilled,
      size: class_modules.button.sizeSmall,
      contents: class_modules.button.contents,

      colorRed: class_modules.button.colorRed,
      sizeXlarge: class_modules.button.sizeXlarge,
    },
    nav: {
      list: class_modules.nav.navList,
      button: class_modules.nav.navButton,
      item: class_modules.nav.navItem,
      active: class_modules.nav.navButtonActive,
    },
    divider: {
      divider: class_modules.divider1.divider,
      dividerDefault: class_modules.divider2.dividerDefault,
    },
    look: {
      button: class_modules.look.button,
      lookBlank: class_modules.look.lookBlank,
      colorBrand: class_modules.look.colorBrand,
      grow: class_modules.look.grow,
      contents: class_modules.look.contents,
    },
    icon: {
      icon: class_modules.icon.icon,
      active: class_modules.icon.active,
      button: class_modules.icon.button,
      buttonWrapper: class_modules.icon.buttonWrapper,
    },
    textarea: {
      textAreaSlate: class_modules.textarea.textAreaSlate,
      buttonContainer: class_modules.textarea.buttonContainer,
      button: class_modules.textarea.button,
    },
  };

  const getDCCon = (idx) => {
    return new Promise((resolve, reject) => {
      request.post(
        "https://dccon.dcinside.com/index/package_detail",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
          },
          body: `package_idx=${idx}`,
        },
        (err, _, body) => {
          if (err) reject(err);

          const original = JSON.parse(body);

          const info = {
            package_idx: original.info.package_idx,
            title: original.info.title,
            main_img_path: original.info.main_img_path,
            list_img_path: original.info.list_img_path,
          };

          const detail = original.detail.map((x) => {
            return { idx: x.idx, title: x.title, ext: x.ext, path: x.path };
          });

          resolve({ info, detail });
        }
      );
    });
  };

  const getDCConImage = (con) => {
    return new Promise((resolve, reject) => {
      request.get(DCConBaseURL + con.path, { encoding: null }, (err, _, body) => {
        if (err) reject(err);

        resolve(new File([body], `dccon.${con.ext}`, { type: `image/${con.ext}` }));
      });
    });
  };

  const getDCConSearchResult = (query) => {
    return new Promise((resolve, reject) => {
      request.get(encodeURI("https://dccon.dcinside.com/hot/1/title/" + query), (err, _, body) => {
        if (err) reject(err);

        const parser = new DOMParser();
        const doc = parser.parseFromString(body, "text/html");

        if (doc.getElementsByClassName("dccon_search_none").length > 0) resolve([]);

        resolve(
          [...doc.getElementsByClassName("link_product")].map((el) => {
            const idx = el.href.split("#")[1];
            const thumb = el.children[0].src;
            const name = el.children[1].innerText;
            const seller = el.children[2].innerText;

            return { idx, thumb, name, seller };
          })
        );
      });
    });
  };

  // const getArcaConSearchResult = (query) => {
  //   return new Promise((resolve, reject) => {
  //     request.get(encodeURI("https://arca.live/e/?target=title&keyword=" + query), (err, _, body) => {
  //       if (err) reject(err);

  //       const parser = new DOMParser();
  //       const doc = parser.parseFromString(body, "text/html");

  //       resolve(
  //         [...doc.getElementsByClassName("emoticon")].map((el) => {
  //           const idx = el.parentElement.href.split("?")[0].split("/")[4];
  //           const thumb = el.children[0].src;
  //           const name = el.children[1].children[0].innerText;
  //           const seller = el.children[1].children[2].innerText;

  //           thumbCache[idx] = thumb;

  //           return { idx, thumb, name, seller };
  //         })
  //       );
  //     });
  //   });
  // };

  // const getArcaCon = (idx) => {
  //   return new Promise((resolve, reject) => {
  //     request.get(encodeURI("https://arca.live/e/" + idx), (err, _, body) => {
  //       if (err) reject(err);

  //       const parser = new DOMParser();
  //       const doc = parser.parseFromString(body, "text/html");

  //       const cons = [...doc.getElementsByClassName("emoticon")].filter((e) => e.tagName === "IMG" || e.tagName === "VIDEO").map((e) => e.src);

  //       const thumb = thumbCache[idx] ? thumbCache[idx] : cons[0];

  //       const info = {
  //         package_idx: idx.toString(),
  //         title: doc.getElementsByClassName("article-head")[0].children[0].innerText.trim(),
  //         main_img_path: thumb,
  //         list_img_path: thumb,
  //         isArca: true,
  //       };

  //       resolve({ info, cons });
  //     });
  //   });
  // };

  const DownArrowIcon = (props) => {
    const size = props.size || "16px";
    return React.createElement(
      "svg",
      {
        className: props.className || "",
        fill: "currentColor",
        viewBox: "0 0 24 24",
        style: {
          width: size,
          height: size,
        },
      },
      React.createElement("path", {
        d: "M8.12 9.29L12 13.17l3.88-3.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0L6.7 10.7c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z",
      })
    );
  };

  const RecentIcon = (props) => {
    const size = props.size || "18px";

    return React.createElement(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "#b9bbbe",
        className: props.className || "",
        style: {
          width: size,
          height: size,
        },
        onClick: props.onClick,
      },
      React.createElement("path", {
        d: "M12 2C6.4764 2 2 6.4764 2 12C2 17.5236 6.4764 22 12 22C17.5236 22 22 17.5236 22 12C22 6.4764 17.5236 2 12 2ZM12 5.6C12.4422 5.6 12.8 5.95781 12.8 6.4V11.5376L16.5625 13.7126C16.9453 13.9329 17.0703 14.4173 16.85 14.8001C16.6297 15.183 16.1453 15.3079 15.7625 15.0876L11.6873 12.7376C11.656 12.7251 11.6279 12.7048 11.5998 12.6876C11.3607 12.5486 11.1998 12.2954 11.1998 12.0001V6.4001C11.1998 5.9579 11.5578 5.6 12 5.6Z",
      })
    );
  };

  const ManduIcon = (props) => {
    const size = props.size || "24px";

    return React.createElement(
      "svg",
      {
        viewBox: "0 0 512 512",
        className: classes.icon.icon,
        "aria-hidden": "false",
        width: size,
        height: size,
      },
      React.createElement("path", {
        transform: "translate(0,512) scale(0.1,-0.1)",
        fill: "currentColor",
        d: "M2490 4778 c-142 -20 -270 -116 -332 -248 -30 -65 -35 -70 -58 -65 -60 14 -195 17 -249 5 -179 -39 -278 -147 -360 -391 -26 -79 -30 -85 -72 -108 -341 -182 -501 -295 -723 -511 -340 -331 -569 -722 -654 -1120 -91 -420 -29 -784 190 -1112 74 -111 257 -298 373 -380 480 -339 1130 -509 1955 -509 733 0 1322 133 1785 401 148 86 244 159 365 280 169 167 278 341 344 545 119 368 71 803 -133 1220 -126 255 -278 462 -497 675 -222 216 -383 329 -723 511 -44 23 -45 26 -82 137 -21 63 -50 134 -65 159 -53 91 -150 164 -263 199 -56 18 -182 19 -245 3 -26 -6 -48 -10 -49 -8 -2 2 -18 35 -36 72 -61 126 -192 226 -316 242 -27 3 -59 7 -70 9 -11 2 -49 -1 -85 -6z m-470 -1163 c62 -32 92 -105 72 -174 -17 -55 -364 -396 -409 -403 -111 -16 -198 72 -178 179 6 32 32 64 173 207 92 92 181 177 197 187 36 23 105 25 145 4z m621 -8 c64 -42 70 -68 67 -284 -3 -177 -5 -194 -24 -220 -47 -63 -132 -84 -195 -47 -70 41 -74 54 -77 267 -2 168 0 196 15 227 26 50 76 80 133 80 32 0 58 -7 81 -23z m597 9 c15 -8 104 -92 199 -188 187 -189 198 -207 174 -288 -13 -45 -69 -96 -112 -102 -74 -11 -86 -4 -276 185 -192 189 -211 216 -200 284 8 46 30 79 70 103 38 24 106 26 145 6z",
      })
    );
  };

  const Category = (props) => {
    const defaultExpanded = props.expandData[props.idx] ?? true;
    const [expanded, setExpanded] = React.useState(defaultExpanded);
    const rootRef = React.useRef(null);

    React.useEffect(() => {
      props.categoryRef(rootRef.current);
    }, []);

    React.useEffect(() => {
      if (expanded === defaultExpanded) return;
      props.setExpanded(props.idx, expanded);
    }, [expanded]);

    return React.createElement(
      "div",
      {
        ref: rootRef,
        className: "bd-emote-category dccon-category",
      },
      React.createElement(
        "div",
        {
          className: `bd-emote-header ${expanded ? "expanded" : "collapsed"}`,
          style: props.isCon
            ? {
                height: 60,
                flexBasis: "100%",
              }
            : { flexBasis: "100%" },
        },
        React.createElement(
          "div",
          {
            className: "bd-emote-header-inner",
            onClick: () => setExpanded(!expanded),
          },
          React.createElement(
            "div",
            {},
            props.isCon ? React.createElement("img", { src: DCConBaseURL + props.iconPath, style: { borderRadius: 10 } }) : props.icon
          ),
          React.createElement(
            "div",
            {
              className: "bd-emote-header-label",
            },
            props.label
          ),
          React.createElement(
            "div",
            {
              className: `bd-emote-collapse-icon ${expanded ? "expanded" : "collapsed"}`,
            },
            React.createElement(DownArrowIcon, null)
          )
        )
      ),
      expanded && props.children
    );
  };

  const ConMenu = (props) => {
    const sendMedia = async (con, close = true) => {
      const image = await getDCConImage(con);

      WebpackModules.getByProps("instantBatchUpload").upload({ channelId: SelectedChannelStore.getChannelId(), file: image });

      if (close) {
        closeExpressionPicker();
      }

      const recentCons = loadData("DCCon", "recent");

      if (recentCons.filter((x) => x.idx === con.idx).length === 0) {
        recentCons.unshift(con);
        recentCons.splice(20);

        saveData("DCCon", "recent", recentCons);
      }
    };

    return props.cons.map((con) =>
      React.createElement(
        "div",
        {
          className: "bd-emote-item",
          style: { width: 105, height: 105 },
          onClick: (event) => {
            sendMedia(con, !event.shiftKey);
          },
        },
        React.createElement("img", { src: DCConBaseURL + con.path, loading: "lazy" })
      )
    );
  };

  const DCConPage = function (props) {
    if (props.type !== "dccon") {
      Dispatcher.dispatch({
        type: "DCCON_ACTIVE",
        active: false,
      });

      return null;
    }

    if (props.cons.length === 0) {
      return React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("span", { style: { color: "#FFF", fontSize: "1.5rem", fontWeight: "bold" } }, texts.blankPage)
      );
    }

    const expandData = loadData("DCCon", "expand");
    const [categoryRefs, setCategoryRefs] = React.useState({});
    const [query, setQuery] = React.useState("");

    const setExpanded = (idx, expanded) => {
      expandData[idx] = expanded;
      saveData("DCCon", "expand", expandData);
    };

    const categoryRef = (idx, func) => {
      setCategoryRefs((prev) => ({ ...prev, [idx]: func }));
    };

    const consFilter = (con) => {
      return con.info.title.indexOf(query) !== -1 || con.detail.some((x) => x.title.indexOf(query) !== -1);
    };

    React.useEffect(() => {
      Dispatcher.dispatch({
        type: "DCCON_ACTIVE",
        active: true,
      });

      return () => {
        Dispatcher.dispatch({
          type: "DCCON_ACTIVE",
          active: false,
        });
      };
    }, []);

    return React.createElement(
      "div",
      {
        id: `dccon-picker-tab-panel`,
        "aria-labelledby": `dccon-picker-tab`,
        role: "tabpanel",
        className: `${classes.gutter.container} fm-pickerContainer`,
      },

      // Header
      React.createElement(
        "div",
        {
          className: `${classes.gutter.header} fm-header`,
        },
        React.createElement(
          "div",
          {
            className: `${classes.flex.flex} ${classes.flex.horizontal} ${classes.flex.justifyStart} ${classes.flex.alignCenter} ${classes.flex.noWrap}`,
            style: { flex: "1 1 auto" },
          },
          React.createElement(
            "div",
            {
              className: `${classes.gutter.searchBar} ${classes.container.container} ${classes.container.medium}`,
            },
            React.createElement(
              "div",
              {
                className: classes.container.inner,
              },
              React.createElement("input", {
                className: classes.container.input,
                placeholder: texts.searchPlaceholder,
                autofocus: true,
                value: query,
                onChange: (e) => setQuery(e.target.value),
              }),
              React.createElement(
                "div",
                {
                  className: `${classes.container.iconLayout} ${classes.container.medium} ${query ? classes.container.pointer : ""}`,
                  tabindex: "-1",
                  role: "button",
                  onClick: () => {
                    setQuery("");
                  },
                  style: { marginRight: 7 },
                },
                React.createElement(
                  "div",
                  {
                    className: classes.container.iconContainer,
                  },
                  React.createElement(
                    "svg",
                    {
                      className: `${classes.search.icon} ${query ? "" : ` ${classes.search.visible}`}`,
                      "aria-hidden": false,
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                    },
                    React.createElement("path", {
                      fill: "currentColor",
                      d: "M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z",
                    })
                  ),
                  React.createElement(
                    "svg",
                    {
                      className: `${classes.container.clear} ${query ? ` ${classes.container.visible}` : ""}`,
                      "aria-hidden": false,
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                    },
                    React.createElement("path", {
                      fill: "currentColor",
                      d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z",
                    })
                  )
                )
              )
            )
          )
        )
      ),

      // Body
      React.createElement("div", { className: `bd-emote-menu ${classes.gutter.content} fm-pickerContent`, style: { display: "flex" } }, [
        // Bar
        React.createElement(
          "div",
          {
            className: "dccon-category-bar",
          },
          [
            React.createElement(
              "div",
              { className: "dccon-category-item" },
              React.createElement(RecentIcon, {
                size: 45,
                onClick: () => {
                  categoryRefs.recent.scrollIntoView();
                },
              })
            ),
            ...props.cons.filter(consFilter).map((item) =>
              React.createElement(
                "div",
                {
                  className: "dccon-category-item",
                  onClick: () => {
                    categoryRefs[item.info.package_idx].scrollIntoView();
                  },
                },
                React.createElement("img", { src: DCConBaseURL + item.info.list_img_path, style: { borderRadius: 10 } })
              )
            ),
          ]
        ),

        // Cons
        React.createElement(
          Scroller,
          { className: "bd-emote-scroller" },
          React.createElement("div", { className: "bd-emote-menu-inner", style: { padding: 10 } }, [
            React.createElement(
              Category,
              {
                label: texts.recent,
                icon: React.createElement(RecentIcon),
                isCon: false,
                idx: "recent",
                expandData,
                setExpanded,
                categoryRef: (func) => {
                  categoryRef("recent", func);
                },
              },
              React.createElement(ConMenu, { cons: loadData("DCCon", "recent") })
            ),
            ...props.cons.filter(consFilter).map((item) =>
              React.createElement(
                Category,
                {
                  label: item.info.title,
                  iconPath: item.info.list_img_path,
                  isCon: true,
                  idx: item.info.package_idx,
                  expandData,
                  setExpanded,
                  categoryRef: (func) => {
                    categoryRef(item.info.package_idx, func);
                  },
                },
                React.createElement(ConMenu, { cons: item.detail })
              )
            ),
          ])
        ),
      ])
    );
  };

  const Button = (props) => {
    const color = props.color ?? classes.button.color;
    const size = props.size ?? classes.button.size;

    return React.createElement(
      "button",
      {
        type: "button",
        className: `${classes.button.button} ${classes.button.looks} ${color} ${size}`,
        tabindex: -1,
        onClick: props.onClick,
        disabled: props.disabled,
        style: { ...props.style },
      },
      React.createElement("div", { className: classes.button.content }, props.text)
    );
  };

  const Display = (props) => {
    return React.createElement(
      "div",
      { style: { backgroundColor: "var(--background-secondary)", padding: 10, borderRadius: 10 } },
      React.createElement(Scroller, { style: { height: "30vh", borderRadius: 10 } }, props.children)
    );
  };

  const DCConButton = () => {
    const [active, setActive] = React.useState(false);

    const changeActive = ({ active }) => {
      setActive(active);
    };

    React.useEffect(() => {
      Dispatcher.subscribe("DCCON_ACTIVE", changeActive);

      return () => {
        Dispatcher.unsubscribe("DCCON_ACTIVE", changeActive);
      };
    }, []);

    return React.createElement(
      "div",
      {
        onClick: toggleDCCon,
        className: `${classes.textarea.buttonContainer} expression-picker-chat-input-button`,
      },

      React.createElement(
        "button",
        {
          className: `${classes.look.button} ${classes.look.lookBlank} ${classes.look.colorBrand} ${classes.look.grow}${
            active ? ` ${classes.icon.active}` : ""
          } fm-button`,
          tabindex: "0",
          type: "button",
        },
        React.createElement(
          "div",
          {
            className: `${classes.look.contents} ${classes.textarea.button} ${classes.icon.button} fm-buttonContent`,
          },
          React.createElement(
            "div",
            {
              className: `${classes.icon.buttonWrapper} fm-buttonWrapper`,
              style: { opacity: "1", transform: "none" },
            },
            React.createElement(ManduIcon)
          )
        )
      )
    );
  };

  return class DCCon extends Plugin {
    onStart() {
      Logger.log("Started");

      PluginUtilities.addStyle(
        "dccon-css",
        `

        .bd-emote-menu img {
          -webkit-user-drag: none;
        }

        .dccon-category {
          display: grid;
          grid-template-columns: repeat(auto-fill, 110px);
          justify-content: space-between;
        }

        .dccon-category :first-child {
          grid-column: 1 / -1;
        }
        
        .dccon-category-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;

          background-origin: content-box;
          background-color: var(--background-tertiary);
          padding: 7px;

          overflow: hidden scroll;
          min-width: 90px;
          min-height: 0;
        }

        .dccon-category-bar::-webkit-scrollbar {
          display: none;
        }

        .dccon-category-item {
          width: 70px;
          padding: 2px;

          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 10px;
        }

        .dccon-category-item:hover {
          background-color: #4f545c;
        }

        .cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card {
          display: flex;
          background-color: var(--background-tertiary);
          border-radius: 10px;

          width: 98%;
          height: 100px;
        }
      
        .card img {
          width: 100px;
          height: 100px;
        }

        .card-content {
          display: flex;
          flex-direction: column;

          padding: 10px;
          width: 100%;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .noMarginBottom {
          margin-bottom: 0;
        }
      `
      );

      if (loadData("DCCon", "cons") === undefined) {
        saveData("DCCon", "cons", []);
      }

      if (loadData("DCCon", "expand") === undefined) {
        saveData("DCCon", "expand", {});
      }

      if (loadData("DCCon", "recent") === undefined) {
        saveData("DCCon", "recent", []);
      }

      if (loadData("DCCon", "hideButton") === undefined) {
        saveData("DCCon", "hideButton", false);
      }

      this.cons = loadData("DCCon", "cons");
      // this.pressed = {
      //   ctrl: false,
      //   d: false,
      // };

      this.patchExpressionPicker();
      this.patchChannelTextArea();

      // window.addEventListener("keyup", this.shortcutKeyUp);
      // window.addEventListener("keydown", this.shortcutKeyDown);

      PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/minibox24/DCCon/main/DCCon.plugin.js");
    }

    patchExpressionPicker() {
      Patcher.after(ExpressionPicker, "type", (_, __, returnValue) => {
        const originalChildren = Utilities.getNestedProp(returnValue, "props.children.props.children");
        if (!originalChildren) return;

        returnValue.props.children.props.children = (props) => {
          const childrenReturn = Reflect.apply(originalChildren, null, [props]);
          let head = Utilities.getNestedProp(childrenReturn, "props.children.props.children.1.props.children.1.props.children.props.children");
          if (!head) head = Utilities.getNestedProp(childrenReturn, "props.children.props.children.1.props.children.0.props.children.props.children");
          const body = Utilities.getNestedProp(childrenReturn, "props.children.props.children.1.props.children");
          if (!head || !body) return childrenReturn;

          try {
            const elementType = head[0].type.type;
            const activeMediaPicker = WebpackModules.getByProps("useExpressionPickerStore").useExpressionPickerStore.getState().activeView;

            head.push(
              React.createElement(
                elementType,
                {
                  id: "dccon-picker-tab",
                  "aria-controls": "dccon-picker-tab-panel",
                  "aria-selected": activeMediaPicker === "dccon",
                  className: "fm-pickerTab",
                  viewType: "dccon",
                  isActive: activeMediaPicker === "dccon",
                },
                texts.tabName.dccon
              )
            );

            body.push(React.createElement(DCConPage, { type: activeMediaPicker, cons: this.cons }));
          } catch (err) {
            Logger.error("Error in ExpressionPicker\n", err);
          }

          return childrenReturn;
        };
      });
    }

    onStop() {
      Logger.log("Stopped");
      PluginUtilities.removeStyle("dccon-css");
      Patcher.unpatchAll();

      window.removeEventListener("onkeyup", this.shortcutKeyUp);
      window.removeEventListener("onkeydown", this.shortcutKeyDown);
    }

    patchChannelTextArea() {
      Patcher.after(ChannelTextAreaButtons, "type", (_, __, returnValue) => {
        if (Utilities.getNestedProp(returnValue, "props.children.1.props.type") === "sidebar") return;
        if (!returnValue.props.children.some((el) => el.key === "sticker")) return;

        const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
        let perms = true;

        try {
          perms = Permissions.can(PermissionsConstants.SEND_MESSAGES, channel, UserStore.getCurrentUser().id);
        } catch (_) {}
        try {
          perms = Permissions.can(PermissionsConstants.SEND_MESSAGES, UserStore.getCurrentUser(), channel);
        } catch (_) {}

        if (!channel.type && !perms) return;

        const buttons = returnValue.props.children;
        if (!buttons || !Array.isArray(buttons)) return;
        if (loadData("dccon", "hideButton")) return;

        buttons.splice(3, 0, React.createElement(DCConButton));
      });
    }

    getSettingsPanel() {
      const MyDCConPage = (props) => {
        const { cons, setCons } = props;

        const sortCon = (item, move) => {
          const index = cons.indexOf(item);

          if (index + move < 0 || index + move >= cons.length) return;

          const con = this.cons.splice(index, 1);
          this.cons.splice(index + move, 0, con[0]);

          setCons([...this.cons]);
          saveData("DCCon", "cons", this.cons);
        };

        return React.createElement(
          Display,
          {},
          React.createElement("div", { className: "cards" }, [
            ...cons.map((item) =>
              React.createElement("div", { className: "card" }, [
                React.createElement("img", {
                  src: DCConBaseURL + item.info.main_img_path,
                  style: { borderRadius: 10 },
                }),
                React.createElement("div", { className: "card-content" }, [
                  React.createElement("div", { style: { display: "flex" } }, [
                    React.createElement("h1", { className: `${classes.text.h1} ${classes.text.defaultColor}` }, item.info.title),
                    React.createElement("div", { style: { display: "flex" } }, [
                      React.createElement(
                        "svg",
                        {
                          width: 24,
                          height: 24,
                          viewBox: "0 0 24 24",
                          className: classes.text.defaultColor,
                          onClick: () => {
                            sortCon(item, -1);
                          },
                        },
                        React.createElement("path", { d: "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z", fill: "currentColor" })
                      ),
                      React.createElement(
                        "svg",
                        {
                          width: 24,
                          height: 24,
                          viewBox: "0 0 24 24",
                          className: classes.text.defaultColor,
                          onClick: () => {
                            sortCon(item, 1);
                          },
                        },
                        React.createElement("path", { d: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z", fill: "currentColor" })
                      ),
                    ]),
                  ]),
                  React.createElement(
                    "span",
                    { className: classes.text.defaultColor, style: { marginTop: 5 } },
                    texts.conCount.replace("{0}", item.detail.length)
                  ),

                  React.createElement(Button, {
                    text: texts.button.remove,
                    color: classes.button.colorRed,
                    onClick: () => {
                      this.cons.splice(this.cons.indexOf(item), 1);

                      setCons([...this.cons]);
                      saveData("DCCon", "cons", this.cons);
                    },
                    style: {
                      marginLeft: "auto",
                      marginTop: "auto",
                    },
                  }),
                ]),
              ])
            ),
          ])
        );
      };

      const ShopPage = (props) => {
        const { cons, setCons } = props;
        const [query, setQuery] = React.useState("");
        const [results, setResults] = React.useState([]);

        const checkExist = (idx) => {
          return cons.some((x) => x.info.package_idx === idx);
        };

        const search = async () => {
          const res = [];

          res.push(await getDCConSearchResult(query));
          // res.push(await getArcaConSearchResult(query));

          setResults(res.flat());
        };

        return React.createElement("div", { style: { backgroundColor: "var(--background-secondary)", borderRadius: 10 } }, [
          React.createElement(
            "div",
            {
              className: `${classes.flex.flex} ${classes.flex.horizontal} ${classes.flex.justifyStart} ${classes.flex.alignCenter} ${classes.flex.noWrap}`,
              style: { flex: "1 1 auto" },
            },
            React.createElement(
              "div",
              {
                className: `${classes.gutter.searchBar} ${classes.container.container} ${classes.container.medium}`,
              },
              React.createElement(
                "div",
                {
                  className: classes.container.inner,
                },
                React.createElement("input", {
                  className: classes.container.input,
                  placeholder: texts.searchPlaceholder,
                  autofocus: true,
                  value: query,
                  onChange: (e) => setQuery(e.target.value),
                  onKeyDown: (e) => {
                    if (e.keyCode === 13) search();
                  },
                }),
                React.createElement(
                  "div",
                  {
                    className: `${classes.container.iconLayout} ${classes.container.medium} ${query ? classes.container.pointer : ""}`,
                    tabindex: "-1",
                    role: "button",
                    onClick: search,
                    style: { marginRight: 7 },
                  },
                  React.createElement(
                    "div",
                    {
                      className: classes.container.iconContainer,
                    },
                    React.createElement(
                      "svg",
                      {
                        className: `${classes.container.clear} ${classes.container.visible}`,
                        "aria-hidden": false,
                        width: "24",
                        height: "24",
                        viewBox: "0 0 24 24",
                      },
                      React.createElement("path", {
                        fill: "currentColor",
                        d: "M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z",
                      })
                    )
                  )
                )
              )
            )
          ),

          React.createElement(
            Display,
            {},
            React.createElement("div", { className: "cards" }, [
              ...results.map((item) =>
                React.createElement("div", { className: "card" }, [
                  React.createElement("img", {
                    src: item.thumb,
                    style: { borderRadius: 10 },
                    crossOrigin: "anonymous",
                  }),
                  React.createElement("div", { className: "card-content" }, [
                    React.createElement("h1", { className: `${classes.text.h1} ${classes.text.defaultColor}` }, item.name),
                    React.createElement("span", { className: classes.text.defaultColor, style: { marginTop: 5 } }, item.seller),

                    React.createElement(Button, {
                      text: texts.button.save,
                      disabled: checkExist(item.idx),
                      onClick: async () => {
                        this.cons.push(await getDCCon(item.idx));

                        setCons([...this.cons]);
                        saveData("DCCon", "cons", this.cons);
                      },
                      style: {
                        marginLeft: "auto",
                        marginTop: "auto",
                      },
                    }),
                  ]),
                ])
              ),
            ])
          ),
        ]);
      };

      const SettingPage = (props) => {
        const [enabled, setEnabled] = React.useState(!loadData("dccon", "hideButton"));

        return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } }, [
          React.createElement("div", {}, [
            React.createElement("h5", { className: classes.text.h5, style: { marginBottom: 5 } }, texts.setting.button),

            React.createElement(
              DiscordModules.SwitchRow,
              {
                value: enabled,
                onChange: (e) => {
                  saveData("dccon", "hideButton", !e);
                  setEnabled(e);
                },
                hideBorder: true,
                className: "noMarginBottom",
              },
              React.createElement("div", { className: classes.text.defaultColor }, texts.setting.btnText)
            ),
          ]),

          React.createElement("div", {}, [
            React.createElement("h5", { className: classes.text.h5, style: { marginBottom: 5 } }, texts.setting.data),
            React.createElement(Button, {
              text: texts.modal.dataTitle,
              color: classes.button.colorRed,
              style: { width: 200 },
              onClick: () => {
                Modals.showConfirmationModal(texts.modal.dataTitle, texts.modal.dataDesc, {
                  danger: true,
                  onConfirm: () => {
                    this.cons = [];
                    props.setCons([]);

                    saveData("DCCon", "cons", []);
                    saveData("DCCon", "expand", {});
                    saveData("DCCon", "recent", []);
                  },
                });
              },
            }),
            React.createElement(Button, {
              text: texts.modal.recentTitle,
              color: classes.button.colorRed,
              style: { width: 200, marginTop: 10 },
              onClick: () => {
                Modals.showConfirmationModal(texts.modal.recentTitle, texts.modal.recentDesc, {
                  danger: true,
                  onConfirm: () => {
                    saveData("DCCon", "recent", []);
                  },
                });
              },
            }),
          ]),

          React.createElement("div", {}, [
            React.createElement("h5", { className: classes.text.h5, style: { marginBottom: 5 } }, texts.setting.info),
            React.createElement(
              "div",
              { className: classes.text.defaultColor },
              texts.setting.saved
                .replace("{0}", props.cons.length)
                .replace("{1}", props.cons.length === 0 ? 0 : props.cons.map((x) => x.detail.length).reduce((x, y) => x + y))
            ),
          ]),
        ]);
      };

      return React.createElement(() => {
        const [cons, setCons] = React.useState(this.cons);
        const [page, setPage] = React.useState("cons");

        return React.createElement("div", {}, [
          React.createElement("div", { className: classes.nav.list }, [
            React.createElement(
              "button",
              {
                className: `${classes.nav.button} ${classes.nav.item} ${classes.button.button} ${page === "cons" ? classes.nav.active : ""}`,
                onClick: () => setPage("cons"),
              },
              React.createElement("div", { className: classes.button.content }, texts.tabName.mydccon)
            ),
            React.createElement(
              "button",
              {
                className: `${classes.nav.button} ${classes.nav.item} ${classes.button.button} ${page === "shop" ? classes.nav.active : ""}`,
                onClick: () => setPage("shop"),
              },
              React.createElement("div", { className: classes.button.content }, texts.tabName.shop)
            ),
            React.createElement(
              "button",
              {
                className: `${classes.nav.button} ${classes.nav.item} ${classes.button.button} ${page === "settings" ? classes.nav.active : ""}`,
                onClick: () => setPage("settings"),
              },
              React.createElement("div", { className: classes.button.content }, texts.tabName.setting)
            ),
          ]),
          React.createElement("div", { className: `${classes.divider.divider} ${classes.divider.dividerDefault}`, style: { marginBottom: 15 } }),

          (() => {
            switch (page) {
              case "cons":
                return React.createElement(MyDCConPage, { cons, setCons });
              case "shop":
                return React.createElement(ShopPage, { cons, setCons });
              case "settings":
                return React.createElement(SettingPage, { cons, setCons });
            }
          })(),
        ]);
      });
    }

    // shortcutKeyUp = (e) => {
    //   if (e.which == 17) this.pressed.ctrl = false;
    //   if (e.which == 68) this.pressed.d = false;
    // };

    // shortcutKeyDown = (e) => {
    //   if (e.which == 17) this.pressed.ctrl = true;
    //   if (e.which == 68) this.pressed.d = true;

    //   if (this.pressed.ctrl && this.pressed.d) {
    //     toggleDCCon();
    //   }
    // };
  };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
