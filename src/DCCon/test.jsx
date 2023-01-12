const TestComponent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div
      style={{
        backgroundColor: "red",
        width: "100px",
        height: "100px",
      }}
    >
      <div>{count}</div>
      <button
        onClick={() => {
          setCount((x) => x + 1);
        }}
      >
        click me
      </button>
    </div>
  );
};

module.exports = TestComponent;
