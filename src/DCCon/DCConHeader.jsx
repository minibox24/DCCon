const DCConHeader = (props) => {
  return (
    <div
      style={{
        display: "flex",
        height: 50,
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#353535",
          display: "flex",
        }}
      >
        <div
          style={{
            minWidth: 45,
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #484848",
            boxSizing: "border-box",
          }}
        >
          <ArrowLeft />
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              width: 70,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #29367c",
              boxSizing: "border-box",
            }}
          >
            <Smile />
          </div>

          <div>
            <img
              src="//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739"
              alt="원신 쳐다보는콘돚거"
            />
          </div>
          <div>
            <img
              src="//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739"
              alt="원신 쳐다보는콘돚거"
            />
          </div>
          <div>
            <img
              src="//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739"
              alt="원신 쳐다보는콘돚거"
            />
          </div>
          <div>
            <img
              src="//dcimg5.dcinside.com/dccon.php?no=62b5df2be09d3ca567b1c5bc12d46b394aa3b1058c6e4d0ca41648b650e8276e944498ffa97f15561d4ad056d425d7b6c780800fe739d5d3b7b0f71cef6e54e4cad895baaf6711fddb7739"
              alt="원신 쳐다보는콘돚거"
            />
          </div>
        </div>

        <div
          style={{
            minWidth: 45,
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #484848",
            boxSizing: "border-box",
          }}
        >
          <ArrowRight />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#151515",
          minWidth: 50,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #484848",
          boxSizing: "border-box",
        }}
      >
        <HomeDisabled />
      </div>

      <div
        style={{
          backgroundColor: "#151515",
          minWidth: 50,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #484848",
          boxSizing: "border-box",
        }}
      >
        <SettingDisabled />
      </div>
    </div>
  );
};

module.exports = DCConHeader;
