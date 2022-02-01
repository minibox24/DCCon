/**
 * @name DCCon
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
    const config = {"info":{"name":"DCCon","authors":[{"name":"yejun","discord_id":"310247242546151434","github_username":"minibox24"}],"version":"0.3.2","description":"디스코드에서 디시콘을 쉽게 쓸수 있게 도와주는 플러그인","github":"","github_raw":""},"changelog":[{"title":"0.1","items":["`0.1.0` 주요 기능들을 지원합니다"]},{"title":"0.2","items":["`0.2.0` Ctrl+D를 누르면 디시콘 페이지가 열립니다"]},{"title":"0.3","items":["`0.3.0` 디시콘을 보낼 때 Shift키를 누르고 있다면 창이 닫히지 않고 연속으로 보내집니다","`0.3.1` 최근 사용에서 콘이 중복되지 않습니다","`0.3.2` 창 사이즈에 따라 콘들의 간격이 늘어나지 않고 왼쪽에 붙어있게 됩니다"]}],"main":"index.js"};

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
    DiscordModules: { React, SelectedChannelStore },
  } = Library;
  const DCConBaseURL = "https://dcimg5.dcinside.com/dccon.php?no=";

  const { saveData, loadData } = window.BdApi;
  const { toggleExpressionPicker } = WebpackModules.getByProps("toggleExpressionPicker");
  const ExpressionPicker = WebpackModules.getModule((e) => e.type?.displayName === "ExpressionPicker");
  const { ScrollerAuto: Scroller } = WebpackModules.getByProps("ScrollerAuto");
  const request = require("request");

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

          resolve(JSON.parse(body));
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

  const Category = (props) => {
    const [expanded, setExpanded] = React.useState(props.expandData[props.idx] ?? true);
    const rootRef = React.useRef(null);

    React.useEffect(() => {
      props.categoryRef(rootRef.current);
    }, []);

    React.useEffect(() => {
      props.setExpanded(props.idx, expanded);
    }, [expanded]);

    return React.createElement(
      "div",
      {
        ref: rootRef,
        className: "bd-emote-category dccon-category",
        style: {
          display: "flex",
          justifyContent: "space-between",
          flexFlow: "row wrap",
        },
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

      window.WebpackModules = WebpackModules;
      WebpackModules.getByProps("upload").instantBatchUpload(SelectedChannelStore.getChannelId(), [image], 0);

      if (close) {
        WebpackModules.getByProps("closeExpressionPicker").closeExpressionPicker();
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
        React.createElement("img", { src: DCConBaseURL + con.path })
      )
    );
  };

  const DCConPage = function (props) {
    if (props.type !== "dccon") return null;

    if (props.cons.length === 0) {
      return React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("span", { style: { color: "#FFF", fontSize: "1.5rem", fontWeight: "bold" } }, "플러그인 설정에서 디시콘을 추가해보세요!")
      );
    }

    const [categoryRefs, setCategoryRefs] = React.useState({});

    const expandData = loadData("DCCon", "expand");
    const setExpanded = (idx, expanded) => {
      expandData[idx] = expanded;
      saveData("DCCon", "expand", expandData);
    };

    const categoryRef = (idx, func) => {
      setCategoryRefs((prev) => ({ ...prev, [idx]: func }));
    };

    return React.createElement("div", { className: "bd-emote-menu", style: { display: "flex" } }, [
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
          ...props.cons.map((item) =>
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
              label: "최근 사용",
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
          ...props.cons.map((item) =>
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
    ]);
  };

  const Details = (props) => {
    return React.createElement("details", {}, [React.createElement("summary", {}, props.summary), props.children]);
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

        .dccon-category::after {
          content: "";
          flex: auto;
        }
        
        .dccon-category-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;

          background-color: #202225;
          padding: 7px;

          overflow: hidden scroll;
          min-width: 90px;
          min-height: 0;
        }

        .dccon-category-bar::-webkit-scrollbar {
          display: none;
        }

        .dccon-category-item {
          padding: 5px;
          width: 70px;

          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 10px;
        }

        .dccon-category-item:hover {
          background-color: #4f545c;
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

      this.cons = loadData("DCCon", "cons");
      this.pressed = {
        ctrl: false,
        d: false,
      };

      this.patchExpressionPicker();

      window.addEventListener("keyup", this.shortcutKeyUp);
      window.addEventListener("keydown", this.shortcutKeyDown);
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
                "디시콘"
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

    getSettingsPanel() {
      return React.createElement(() => {
        const [cons, setCons] = React.useState(this.cons);
        const [query, setQuery] = React.useState("");
        const [results, setResults] = React.useState([]);

        return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [
          React.createElement(
            Details,
            { summary: "디시콘 리스트" },
            React.createElement("div", { style: { marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } }, [
              ...cons.map((item) =>
                React.createElement("div", { style: { display: "flex" } }, [
                  React.createElement("img", {
                    src: DCConBaseURL + item.info.main_img_path,
                    style: { borderRadius: 10, width: 150, height: 150, marginRight: 10 },
                  }),
                  React.createElement("div", {}, [
                    React.createElement("p", {}, item.info.title),
                    React.createElement("p", {}, item.info.description),
                    React.createElement(
                      "button",
                      {
                        onClick: () => {
                          this.cons.splice(this.cons.indexOf(item), 1);

                          setCons([...this.cons]);
                          saveData("DCCon", "cons", this.cons);
                        },
                      },
                      "제거"
                    ),
                  ]),
                ])
              ),
            ])
          ),

          React.createElement(
            Details,
            { summary: "디시콘 검색" },
            React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, [
              React.createElement("input", { value: query, onChange: (e) => setQuery(e.target.value) }),
              React.createElement(
                "button",
                {
                  onClick: async () => {
                    setResults(await getDCConSearchResult(query));
                  },
                },
                "Search"
              ),
              React.createElement("div", { style: { marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } }, [
                ...results.map((item) =>
                  React.createElement("div", { style: { display: "flex" } }, [
                    React.createElement("img", { src: item.thumb, style: { borderRadius: 10, width: 100, height: 100, marginRight: 10 } }),
                    React.createElement("div", {}, [
                      React.createElement("p", {}, item.name),
                      React.createElement("p", {}, item.seller),
                      React.createElement(
                        "button",
                        {
                          onClick: async () => {
                            this.cons.push(await getDCCon(item.idx));

                            setCons([...this.cons]);
                            saveData("DCCon", "cons", this.cons);
                          },
                          disabled: cons.filter((x) => x.info.package_idx === item.idx).length !== 0,
                        },
                        "저장"
                      ),
                    ]),
                  ])
                ),
              ]),
            ])
          ),
        ]);
      });
    }

    shortcutKeyUp = (e) => {
      if (e.which == 17) this.pressed.ctrl = false;
      if (e.which == 68) this.pressed.d = false;
    };

    shortcutKeyDown = (e) => {
      if (e.which == 17) this.pressed.ctrl = true;
      if (e.which == 68) this.pressed.d = true;

      if (this.pressed.ctrl && this.pressed.d) {
        toggleExpressionPicker("dccon", "normal");
      }
    };
  };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/