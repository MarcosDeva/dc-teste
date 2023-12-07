import React, { Component } from "react";

class Destaques extends Component {
  render() {
    return (
      //   ------------DESTAQUES---------
      <div className="col-sm-12">
        <div
          style={{
            display: "-webkit-box",
            marginBottom: "10px",
            overflow: "scroll",
            overflowY: "hidden",
            columnGap: "10px",
            padding: "0px",
            height: "210px",
          }}
        >
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://i.pinimg.com/736x/8d/fa/78/8dfa78b6b469b3a2026e8c23c9a3f007.jpg"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://i.pinimg.com/originals/ed/0e/fb/ed0efb73182d9a9eebda48b982cbce7d.png"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://i.pinimg.com/originals/58/c6/c1/58c6c15a6cd7d734c8c8dd56549cb3ea.png"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://i.pinimg.com/736x/1e/3c/5a/1e3c5a6ca18d2fbb16e4a7ad17a7bc4b.jpg"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://jorgezanoni.com.br/2019/wp-content/uploads/2020/09/ma3-1-1068x1068.jpg"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://www.kazukisushi.com.br/wp-content/uploads/2021/04/promo01-1-700x701.jpg"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
          <div className="card" style={{ padding: "5px", height: "185px" }}>
            <img
              className="card-img"
              src="https://th.bing.com/th/id/OIP.NTuivSKzUJ-CGso57lTKUgHaHa?pid=ImgDet&rs=1"
              alt=""
              style={{
                borderRadius: "10px",
                maxHeight: "230px",
                maxWidth: "170px",
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Destaques;
