/**
 *
 * @param {import("zerespluginlibrary").Plugin} Plugin
 * @param {import("zerespluginlibrary").BoundAPI} Library
 * @returns
 */

module.exports = (Plugin, Library) => {
  const TestComponent = require("test.js");

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
      Strings,
    },
    Patcher,
  } = Library;

  const BdApi = new window.BdApi("DCCon");
  const { Webpack } = BdApi;

  const PermissionsConstants = Webpack.getModule(
    Webpack.Filters.byProps("ADD_REACTIONS"),
    { searchExports: true }
  );

  let ChannelTextAreaButtons;

  // https://github.com/Strencher/BetterDiscordStuff/blob/master/InvisibleTyping/InvisibleTyping.plugin.js#L483-L494
  function loadChannelTextAreaButtons() {
    const buttonsClassName = WebpackModules.getByProps(
      "profileBioInput",
      "buttons"
    )?.buttons;
    const vnode = ReactTools.getReactInstance(
      document.querySelector(`.${buttonsClassName}`)
    );
    if (!vnode) return;
    for (
      let curr = vnode, max = 100;
      curr !== null && max--;
      curr = curr.return
    ) {
      const tree = curr?.pendingProps?.children;
      let buttons;
      if (
        Array.isArray(tree) &&
        (buttons = tree.find(
          (s) => s?.props?.type && s.props.channel && s.type?.$$typeof
        ))
      ) {
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
        if (
          Utilities.getNestedProp(
            returnValue,
            "props.children.1.props.type"
          ) === "sidebar"
        )
          return;

        const channel = ChannelStore.getChannel(
          SelectedChannelStore.getChannelId()
        );
        const perms = Permissions.can({
          permission: PermissionsConstants.SEND_MESSAGES,
          user: UserStore.getCurrentUser(),
          context: channel,
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
