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

  return (
    <div className={classes.textarea.buttonContainer}>
      <button
        className={`${classes.look.button} ${classes.look.lookBlank} ${classes.look.colorBrand} ${classes.look.grow}`}
        tabIndex="0"
      >
        <div
          className={`${classes.look.contents} ${classes.textarea.button} ${classes.icon.button}`}
        >
          <div
            className={`${classes.icon.buttonWrapper}`}
            style={{ opacity: "1", transform: "none" }}
          >
            <ManduIcon />
          </div>
        </div>
      </button>
    </div>
  );
};

module.exports = DCConButton;
