/**
 *
 * @param {import("zerespluginlibrary").Plugin} Plugin
 * @param {import("zerespluginlibrary").BoundAPI} Library
 * @returns
 */

module.exports = (Plugin, Library) => {
  // #region imports

  const DCConButton = require("DCConButton.js");
  const DCConMain = require("DCConMain.js");

  const DCConHeader = require("DCConHeader.js");

  const ManduIcon = require("icons-Mandu.js");
  const ArrowLeft = require("icons-ArrowLeft.js");
  const ArrowRight = require("icons-ArrowRight.js");
  const HomeDisabled = require("icons-HomeDisabled.js");
  const HomeEnabled = require("icons-HomeEnabled.js");
  const MenuDisabled = require("icons-MenuDisabled.js");
  const MenuEnabled = require("icons-MenuEnabled.js");
  const SettingDisabled = require("icons-SettingDisabled.js");
  const SettingEnabled = require("icons-SettingEnabled.js");
  const Smile = require("icons-Smile.js");

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

  // #endregion

  // #region styles

  const classModules = {
    icon: WebpackModules.getByProps("hoverScale", "buttonWrapper", "button"),
    menu: WebpackModules.getByProps("menu", "scroller", "colorDefault"),
    result: WebpackModules.getByProps("desiredItemWidth", "results", "result"),
    input: WebpackModules.getByProps("inputWrapper", "input", "focused"),
    role: WebpackModules.getByProps("roleCircle"),
    _gif: WebpackModules.getByProps(
      "container",
      "gifFavoriteButton",
      "embedWrapper"
    ),
    gif: WebpackModules.getByProps("size", "gifFavoriteButton", "selected"),
    image: WebpackModules.getByProps(
      "flexCenter",
      "imageWrapper",
      "imageWrapperBackground"
    ),
    control: WebpackModules.getByProps("container", "labelRow", "control"),
    category: WebpackModules.getByProps(
      "container",
      "categoryFade",
      "categoryFadeBlurple"
    ),
    textarea: WebpackModules.getByProps(
      "textAreaHeight",
      "channelTextArea",
      "highlighted"
    ),
    gutter: WebpackModules.getByProps("gutterSize", "container", "content"),
    _flex: WebpackModules.getByProps(
      "_flex",
      "_horizontal",
      "_horizontalReverse"
    ),
    flex: WebpackModules.getByProps("flex", "alignStart", "alignEnd"),
    color: WebpackModules.getByProps("selectable", "strong", "colorStandard"),
    size: WebpackModules.getByProps("size10", "size12", "size14"),
    title: WebpackModules.getByProps("title", "h1", "h2"),
    container: WebpackModules.getByProps("container", "inner", "pointer"),
    scroller: WebpackModules.getByProps("scrollerBase", "thin", "fade"),
    look: WebpackModules.getByProps(
      "lowSaturationUnderline",
      "button",
      "lookFilled"
    ),
    audio: WebpackModules.getByProps(
      "wrapper",
      "wrapperAudio",
      "wrapperPaused"
    ),
  };

  const classes = {
    icon: {
      icon: classModules.icon.icon,
      active: classModules.icon.active,
      button: classModules.icon.button,
      buttonWrapper: classModules.icon.buttonWrapper,
    },
    menu: {
      item: classModules.menu.item,
      labelContainer: classModules.menu.labelContainer,
      label: classModules.menu.label,
      colorDefault: classModules.menu.colorDefault,
      focused: classModules.menu.focused,
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
      endContainer: classModules.result.endContainer,
    },
    input: {
      inputDefault: classModules.input.inputDefault,
      inputWrapper: classModules.input.inputWrapper,
    },
    roleCircle: classModules.role.roleCircle,
    gif: {
      gifFavoriteButton1: classModules._gif.gifFavoriteButton,
      size: classModules.gif.size,
      gifFavoriteButton2: classModules.gif.gifFavoriteButton,
      selected: classModules.gif.selected,
      showPulse: classModules.gif.showPulse,
      icon: classModules.gif.icon,
    },
    image: {
      imageAccessory: classModules.image.imageAccessory,
      clickable: classModules.image.clickable,
      embedWrapper: classModules._gif.embedWrapper,
      imageWrapper: classModules.image.imageWrapper,
    },
    control: classModules.control.control,
    category: {
      categoryFade: classModules.category.categoryFade,
      categoryText: classModules.category.categoryText,
      categoryName: classModules.category.categoryName,
      categoryIcon: classModules.category.categoryIcon,
      container: classModules.category.container,
    },
    textarea: {
      textAreaSlate: classModules.textarea.textAreaSlate,
      buttonContainer: classModules.textarea.buttonContainer,
      button: classModules.textarea.button,
    },
    gutter: {
      header: classModules.gutter.header,
      backButton: classModules.gutter.backButton,
      searchHeader: classModules.gutter.searchHeader,
      searchBar: classModules.gutter.searchBar,
      content: classModules.gutter.content,
      container: classModules.gutter.container,
    },
    flex: {
      flex: classModules._flex.flex,
      horizontal: classModules._flex.horizontal,
      justifyStart: classModules.flex.justifyStart,
      alignCenter: classModules.flex.alignCenter,
      noWrap: classModules.flex.noWrap,
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
      visible: classModules.container.visible,
    },
    scroller: {
      thin: classModules.scroller.thin,
      scrollerBase: classModules.scroller.scrollerBase,
      fade: classModules.scroller.fade,
      content: classModules.scroller.content,
    },
    look: {
      button: classModules.look.button,
      lookBlank: classModules.look.lookBlank,
      colorBrand: classModules.look.colorBrand,
      grow: classModules.look.grow,
      contents: classModules.look.contents,
    },
    audio: {
      wrapperAudio: classModules.audio.wrapperAudio,
    },
  };

  // #endregion

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

  function patchChannelTextArea() {
    loadChannelTextAreaButtons();
    if (ChannelTextAreaButtons == null) return;

    Patcher.after(ChannelTextAreaButtons, "type", (_, __, returnValue) => {
      if (
        Utilities.getNestedProp(returnValue, "props.children.1.props.type") ===
        "sidebar"
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
