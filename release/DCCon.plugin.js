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
  const DCConMain = (props => {
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
  if (!active) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      zIndex: 2000,
      width: 626,
      height: 535,
      position: "fixed",
      bottom: 80,
      right: 16,
      backgroundColor: "#222222",
      border: "1px solid #273272",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(DCConHeader, null));
});
  const DCConHeader = (props => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      backgroundColor: "#353535",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 45,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #484848",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(ArrowLeft, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      display: "flex",
      justifyContent: "space-around"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 70,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "2px solid #29367c",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(Smile, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739",
    alt: "\uC6D0\uC2E0 \uCCD0\uB2E4\uBCF4\uB294\uCF58\uB3DA\uAC70"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739",
    alt: "\uC6D0\uC2E0 \uCCD0\uB2E4\uBCF4\uB294\uCF58\uB3DA\uAC70"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739",
    alt: "\uC6D0\uC2E0 \uCCD0\uB2E4\uBCF4\uB294\uCF58\uB3DA\uAC70"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739",
    alt: "\uC6D0\uC2E0 \uCCD0\uB2E4\uBCF4\uB294\uCF58\uB3DA\uAC70"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739",
    alt: "\uC6D0\uC2E0 \uCCD0\uB2E4\uBCF4\uB294\uCF58\uB3DA\uAC70"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 45,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #484848",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(ArrowRight, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "#151515",
      minWidth: 50,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #484848",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(HomeDisabled, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "#151515",
      minWidth: 50,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #484848",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(SettingDisabled, null)));
});
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
  const ArrowLeft = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAA1klEQVQokZ3SsS5EQRQG4G/tNhRUmttodCqVRCNEJBK8gu70Gi+g9gIn0WuJhpVNlCovoFFrUFCuXOYmm712s3G6+fPNmZnM6QyHQ5MqM09xhv6fMDM7OMdJid5aMDO7uMBxib5w0BtD87jE0SiKiEFvBC3hClsl+sRhjepFr6Bl3GK9oA/sRcRj06hbVdUKHrA2CdU1h3usTkMNnKlquIvnghdxl5kbrY4R8YJNPE3DP0dHxCu2y6MaPMjMndYdI+Id+7gu0QJuGjzzF/5/KMY2/I4Z/W9NlVkK1Xl1ogAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC"
  });
});
  const ArrowRight = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAA30lEQVQokY2SvWpCQRBGjz9NLCT1fREhnSFBrFLYCFY2Xx+sfYE0qe824gOkUasUgRSpfQGb1CnEShBkZWGUu5sscbrdOTD7nZ1aWZYr4BGYSnohUwHcArfWfgUmknyK14EBsLfzMzBzzjVSsOa9xzl3D4Qn3Nj9AhhK2kdgKIOXQMt6n8CTpF0EGtwB3oG2Xa2BnqSfCMzAG+DhF5iD6zlvf+m5anQEZsLcSfq+gKbnowIFPd2Q+DK6IvzsMAjvnx2GahRFkf7KHBhJOqRh3ipQWIqxpGMasgl8/btmwAm8j1kTTgtJmAAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC"
  });
});
  const HomeDisabled = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAcCAYAAADvANYcAAACUklEQVRIie2WvYsTQRjGn+edrIWgaey0OpVr9B/wKsH2xOIqLbwqRAvNIqJoYWNhtxOQkFTqVYLXHIqFiGghKW3tLEWsrIRjP+QNmTBZN/Fmk2jjA0OWnc28v3m/ZlgUBZySJEGgLgK4B2ATwPc4jjFexwA4W1rqRxzHX6qWb4Ra9XQFwBOSEYB3AC4A+DaePgLgE0n/+z0Al6oWkpoA2wB2RCQyxiCKojMi8tFae8J9oAAiAp13Y5bqQFxTD4iIjAFGBhqNxkljzAdr7anR7kT03Whehz4vC+I2gJ7boS5c2vGaMeY9ydMOxB+zFJIT9wE8LAO4uOvv2OXHAbwN2dlBIR6RvKOG1Lga8wGcHAjJo37VLQqhVizJG38C8EHmuT4UQn37mGTbz/J5AD5IiGYhK8BOGUCfQw14Otbr9Sr/XAVxCMBzkpfLAAtqQ0u72+3+1jDKKyvALsmtJQM4XSW5Y62N/JeTsyNJksMAXpE8vyIAqK00TZFl2cs8z7c6nc4+nCeSJGkCeL1KAHglbIzZFJE9a61uHKbZbCrAG5IbrtXqWDaADzJObm3v54bD4Qst0VskvyqZ1wf0GF5bAYOesp9dlZGUNE0fTN0n+v2+o7QAbi5QjrP0rNVqbZfnpppVlmWTPuDCsUyQWa18CkIz1xl2ofkbmoLI83zihTkH0E8A1+ew3QWwHsJe53q3XxTFU1S4t91uYzAYaMzXQ8JY646pxjV/qrylIXVhPChIbQgNnYKU5ZI7JJ9q37YVpMoTIZcZp9W0xf8QNfXvIQD8AsodnBQbNo7vAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII="
  });
});
  const HomeEnabled = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAcCAYAAADvANYcAAACW0lEQVRIie2WPYxMURTHf+e+GYUEjY5qEQ0tz0cjnojEimIrClOisIUIS6HzkEi22GgxlUIzISQy8ZGQbKfVKUVUKslm514574M3M/eN997OROM/ucXcj3N/79xzzr3inMOnMIq9/SM6A9wE5oHvhaEA2D8y98dqf+mLz0iryk4lOg88AmkDb8BFwLds6hbg08iyHnDWZ8o0BOgAXRHTFhNgTGufSPAR2PlniiASoON5K1MTiEvqARFjRIwCkIHsEhO8B3YnCCJZfztr5U6vC3ENeKibJ00BdLPsv5HWnJjgHcie1BNmqE0D4hZwfxRAN0uUwRhp7RBj+ohUNlw1MO8C11OA7IyLALlyENfaWpZ1TSB0l2Xgyl8BCkuSuUyYUgNCw3kFuFgdoMBe/TT8MRFGsQJ0xwFM9c8b1/bDJx94F49BhFG8CXgKnEsDsAiwIR3R1D504t5YwTAegGfAwm8AmQpAIkEugHTDKG4P9edRHEbxZuAFcGwWAImcw7p1nB08d84urPaX1sg9EUbxNuBlChDMBoA8hRP78yKml304cvD4HQV4DRzIAYwE1Ck2deWcxbmBeuStc/a0puhV4KtI0CsA6DU8N4P99Zb9nNYRwRox2MFt73vi6KllLVCLG0jHMj358GqxMzrmPXRn1V0KV730VpPfnhfC2vXk3KbOUKKSsj3RCz+ByxNs3gD2lpr1qMnzbg3cYzXoPFYF6SAKMf2rfEgaL5pieILaaS0gyDK8GkjDh65Lc93asZG02ppadab5a7s0e1zyq5PcU67LzfQfIte/hwB+AfAwkq02y7coAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII="
  });
});
  const MenuDisabled = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAYAAABi8KSDAAAAJElEQVQYlWMMDQ39z0AkYCJWIQgw/v9PtMEkmjzqZhhgYGAAAI38DAQD5dVlAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII="
  });
});
  const MenuEnabled = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAKCAYAAABrGwT5AAAAJUlEQVQokWO09pjwn4FMwESuRhBg/P+fbIsptHnUz/SymYGBAQBjuAxAIBm8rgAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC"
  });
});
  const SettingDisabled = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEaklEQVRYhb1Xa2hcRRT+zswmIopRCBFawRZLfFBqqw2aorW1asUXghapf8W5dcFsFhT1hwjBBz7wbhJwE7C/FIWCD1BEi6IloNHQ/qgSpCqi1AdasKJiYTNz5GxnlvHuvTeb/uiBw4UzM+d8c+a8LjEzhNI0xQrpcc9CL9br9UdXqkBIncohANuIaIKI+rTWwo80Go1bTyeAh4gIlUol5j2nC8AgEd2slGob11q3uVKp3DQ9PX3GSpVVcmRbALwC4EIAh+R9AewD4ABcDqBORFqMiheEPfVrrV+YnJxs1mq1xTRN5XJ3ArgPwGYA3wO4p16v/xAbywbhKgDfEtGZQbmsM/NBZj4GYKfIxHhfXx/ECzFZa7G0tCTf95h5DYDLgh6v6wgzrx8fH28VeWC1GA9uDQCcc1c6504i9gCim3dIAMkagFvCxWSfyL2uYWvtWgBHigB8pZT6W2t9dgxAFAQAQVkegAAub7+nf4jox/+Bzij4l4j2xofCDYJXMgpzQeTt9zxTrVZPFALw7/0UM/8ZXBgrLjOcBySz/yfRnd3XlYbM/LtzbrEHG98AeAPAOwB+6WH/YpIkf/QCYNQ5N5r1QKwIwFYAw8x8NzPfwcyrmfkuAL8WHWLmG5vN5sblAJzFzMY/BXJAHJY6wcxzEmSSdp45SZI3nXMjzHy0BMSeqampc2JZuw6kaSroEwDbiahSkOeCZiMzHw6GY5C1Wq39bTabO5VS7+fFi4ButVrWWjvHzM16vb5PDwwMPA+gQUQXKaVUSbTLoWejW7cVBhCjo6PtTSMjI98tLCzsJqLBgqCVW0mR2jU/P39ehYhqceqU5LlUQ8S3LyJr7QIRXZzVka0T1toH24XIN5PSVGNmG9+4jJxz7b15+uLSrJSy4vVnyqpbRJt6Me7Bblpuj7f3pBobG3tCmgyAj3ygFdE2AOuWU5ymqXTTDWUOAvAugOuTJJloh3m1Wt3PzDcw8wUA3i44qKVME1F/ifEBAHtLPPk6gPONMbcbYz4WQSfPWq2WBMXPzrnJPDf7N9tKRJJia3KMXwHgUyK6JO6AGWoYY47Fok43DGmllPpEa/251vqqgijeLn3dOfcBM3/pdVwN4Bo6OakUtesDxpgvssKOB3zfFyD91tqhIi/4jJFB9Dat9WNKqYeVUtdqrTvGCwAMzczM9BUCiIDsZua1RREfT0SZobQtKxpWmPlS59z9ywIA8ECOrAtEKFzBeI+zgsnKshNRPxFt7rEunMp80JXGWQ8sEdGJnJtI5M73bA04CKCr9xPRgeUAOCLaRUR/eQAyvb4MYD0AmRGuA/BWieHXAOwwxsgYPgzgaQC/+bU5APd2gcr+G/p3HdRaryOirwEcj+cDIlpFREep2/+iaCib50Kzs7PnJklyPA9xF4AQ5SGoQnqGRuTXP9Ra78hg+MwYs6XEO7mUl4adHwypjsL+ZyPm53JS9KWVGhfK/TeM+348eIQ159x+59wEM0uMSHOZNsa8umLrAP4DvyFIBD07yPMAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg=="
  });
});
  const SettingEnabled = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEsklEQVRYhb2XW4hVZRTHf+s7R0OK6kEi7KEEMQvJLMMzJmV5bLJejIjI18jsoWasyOYhgiE93RAlyh7qqSgQqoeiM+YUqMfxQBhhMUkFUZhBDWRUJM3sb8X69j5nzr7NxYcWfC/fZa3/+u9126KqZKVWb+T2CuSZZJnsAZ7uXGmPDs3lfRA355tp2QAMgywQcbZ2gtx9PorOF8CTIg7nKji3IFmV7bb3fwBYDNyJOMRVEeeSVb0DcRfMV1k1u1GrN9YBbwFXAl8k3/cA4IFVwA4RVzFvBYGwQISFIu5lxO0Hxmv1hjm3BXgQWAP8ANzfHh36sddeKghr9cYS4HtgUS+dqnoCdALoD48S6rOUq0Z4P4X66GPgKuBaAyginSvfqvqV7dGhyTIGrgBZFCiVSnhoAEX9jTFQDa6GM4SsCPE7HHcR7ktyX8KZ4pfjZakBKQPwtYj85aR6kYGI0Suqzqiiw7UkivMIzEwFNWZ67yd3Rd3f3kU/9T5JcdgeHfoHkTdj5R0DEqjuBpspLzLeAyJ3vxMrIq+PHXziXCmAIMou0D8C3WnNPaDmIrn7P4Puyj7MATh+6Knf1PvxnP28fAe8B3wI/DIHROOt5uDv2c1cKa7VG33iKmNFUd5RBGwHjvawZK7eA/IqcHmxfYslv/rYyONf9u6mLNTqjQuBbbHeJOrTchJYB3pU1aPe472lXqSq/n1VfxPo6VIOlO19m164OMdArd64F3gYuM0ywyqcsyqXZsDQXI/qSTPuNQL1varidHOVfhE3UhQv4Z2fjNRHR4H97dGhA7J24+6XrLZ3C0aS587yOR3tR0BvDV7rVPC+KFAt8p2rnhJxV+dAqAbgGsDbJ9F95uJAnDYVYs8XFBk3OaEdBT4q+jzxd/b2aaLPi9p8qBOSVNHQRyqPVqfzvJoUjLJUC9AztBfeM6qjULhE8/qSQhZXWRc5EWl0yu6Mea6sVmYz3pXVOmseBxDPueOHdj6bNJlPS3jtiA0hy+Zg3LrpdTOcmxcfAbe3moPDqTqwfvPeJUkub8m/U0u3I+qnNqn6f0uUX2IVXcStiL+zy7L6LvBYqzkw0dlI5VmrOXhG1e+jKIDiWLmFkGKh1WblBmAMZAXdfpH7pHt7jQetRdF6c/8e82JtLhOms2BSNToIfJV01JoRGELMZgWpFnl/uNUc2JBzK1+Kn18ornLKuerSwlKcyeW0NhfSrKRjfqPqVx0b2THZu1lk4QFUl5aU4qJc7k5ILpkRi9u1XoPqQ9ndom7zSMFeDkR3KpZql/Lp3l/2jm3ZrdREVKs3FoKsma4Js/V/mceIEPTl0jjLwJSInAsjd5pGi9z2XE1Z2QbyvV/k8IwA2qNDViTuE5E/E9csYN4AVgJ91oyAD2Yw/A6wsdUcsDF8ObAb+DU5sw64NQeqJA0Xi3PLQE4BZ0Pn6galLBHkdJai5PAyVCdaI4Opg/Wb917aag6eLUKc+zEx8RpNOM9EHM2huYQV25czTiqfCW5jJtrbZlwLmlWZcZPCmcvarfeT8YrCj0a8klbsderFgmbzmu3ZrDAfKfk3TLzuGE15ZS1ZP1H1w6AWI3b4CujbMUuzT7NdAf4DDyv0d+YSiyoAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg=="
  });
});
  const Smile = (() => {
  return /*#__PURE__*/React.createElement("img", {
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEZklEQVRYhc2Zz0/jRhTHv2M7/FDEDykosBUXYGHhigYklOWH3JVWvXBt6ZELvXHaXvoflBO39sKx2b32VonGItoVwkgcOFEJuAHqqhEECFoSj6d6xo5M4iR2YANfaTSS7ef5+M28eTNjJqVEPTHGqu5mMpkYgBSANwAmAYwDSAKIu48UAHwGcABgD8DfAD7qul6q21iAIgFmMpmXAFYBLAFIePe9EiR6v1tyANIA1nVdP3xUwEwm8w2ANQDfA1AVRQEVuufVQZA+ONi27dXCtu0PAN7pun76YEDDMFZcuC4PTNO0QLAgQH9NkFQsy6L6yrZtgvy9KUDDMDoAbFB3UsOqqjpgVDfq1lrye1QI4YAKIdJSymVd17+EBjQMowfAnwDmCMiD8zz4GPJ7UwiRFUIs6rqebwjoeu4vgiMorzTjsbAeJUjLsrKWZb2t9GSQOzYq4bzx9tjygsxth9rcqGziHqAbEEuVcF9bPsilbDa74m+u3MWGYdBUcqCqalcsFmsZnF/umLwqlUrj8/Pzp5Ue/JUx1uUPiFbL9SQxrN3zoGEYlCEONE1T29raylPJU8idgkSxWByfm5s79Ny0qiiK+jUDIqzcwCGWVceDbuI/0zQt0d7e7ngvSPRlNzc3zv2Ojo7IDUe1F0Lkbm9vX2i0KlEUJeHNdUG6vr7G8fExSqW7xUhPTw+Gh4dDj9NCoYCjo6OyfXd3N0ZGRuraM8aI6TU98caf/IO+3A9HyufzOD1tmOfL9n440uXlJU5OTurauV39LQFO1sut1C3+l/shw6iWPUGGAJxUGGOv6gVGrTFJQyKMaj1X670VGifA/np5lgZ0b29v1fX+/v5QgBR4QfYDAwMNbRljSY0xFm80rQwNDeHs7MzpVvIIwVGghBUFFNlfXFw49slkMhA6QHG2tbUl6SvDdlmrpbgbnOeqAgH++4wBPxPgP88ApJYOaODtSSm/owk1Sg6mPUVYeQvTqJJS7mlSyk0p5S9RbGni3d/fD/08pbbR0dHIgAA2FSnlJynlf422n355C9qw6uzsbAYuR2zKwsJCybbt91EASX19faGfTSQSzQCmp6enS87AkFKu044/CiRlApo/G4km9SY8SCzr8Jb8s7Ozh1G9SLl0bGysbuOUMQYHB6PCkT5MTU055zflgSSEeKdp2iIdcYR9C20PJiYmkMvlcH5+jmKx6ERsPB53hgDVTeiKzm08s3sb9+3t7RVN0357ig2TTz9xzsvnNVUnCzs7O3+oqrr0RPuSNOf8R/+FKldZlrUspcy2FOtO1OZy5cUqwFQq9cWyrEXbtlsJSW0tcs6rTrgCB9vMzEyeDnJs2063AI7aeMs5D9xDNDzA3N3dXVEUZS1KdIeUE63+gGgKkILFNM0XjLE1xtgPNAU+EIxWGe8B/Mw5f/gRsD+aTdN8qSgK7fgJNHyuu1P5EJ1z/riH6JUyTTPGGEsxxrzfEK8oq1X8hqCFMK016TfEJoBPnPNovyEA/A8L/QJZy8Nb0wAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC"
  });
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
      ReactDOM,
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
  function patchChannelTextArea() {
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
  function initDCCon() {
    let dccon = document.getElementById("dccon-container");
    if (!dccon) {
      dccon = document.createElement("div");
      dccon.id = "dccon-container";
      document.body.appendChild(dccon);
    }
    const root = ReactDOM.createRoot(dccon);
    root.render(React.createElement(DCConMain));
  }
  return class extends Plugin {
    onStart() {
      Logger.info("Plugin enabled!");
      loadChannelTextAreaButtons();
      patchChannelTextArea();
      initDCCon();
    }
    onStop() {
      Patcher.unpatchAll();
      Logger.info("Plugin disabled!");
    }
  };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/