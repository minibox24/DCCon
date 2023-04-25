const DCConMain = (props) => {
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

  if (!active) return null;

  return (
    <div
      style={{
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
        flexDirection: "column",
      }}
    >
      <DCConHeader />
    </div>
  );
};

module.exports = DCConMain;
