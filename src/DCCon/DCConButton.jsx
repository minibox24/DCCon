const DCConButton = () => {
  const [active, setActive] = React.useState(false);

  const changeActive = ({ active }) => {
    setActive(active);
  };

  React.useEffect(() => {
    Dispatcher.subscribe("DCCON_CALL", changeActive);

    return () => {
      Dispatcher.unsubscribe("DCCON_CALL", changeActive);
    };
  }, []);

  return (
    <div className={classes.textarea.buttonContainer}>
      <button
        className={`${classes.look.button} ${classes.look.lookBlank} ${classes.look.colorBrand} ${classes.look.grow}`}
        tabIndex="0"
        onClick={() => {
          Dispatcher.dispatch({ type: "DCCON_CALL", active: !active });
        }}
      >
        <div
          className={`${classes.look.contents} ${classes.textarea.button} ${classes.icon.button}`}
          style={
            active
              ? {
                  color: "white",
                }
              : null
          }
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
