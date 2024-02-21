import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import MenuSection from "./menuComponents/MenuSection";
import DetailTab from "../userreview/DetailTab";

const UserDetail = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  let { id } = useParams();
  console.log(id); // 콘솔에 id 값이 출력되어야 합니다.

  const goReservation = () => {
    navigate(`/reservation/${id}`);
  };
 const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [detail, setDetails] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/partner/base/detail/${id}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log(data, "한번만제발 조회해라..");
          setDetails(data);
        }
      });
  }, [id]); // 두 번째 인자로 의존성 배열을 추가하여 id가 변경될 때만 useEffect 실행

  console.log(detail, "누구여");

  useEffect(() => {
    if (detail.fileList && detail.fileList.length > 0) {
      setSelectedImage(detail.fileList[0].imageUrl); // 첫 번째 이미지를 선택된 이미지로 설정
    } else {
      setSelectedImage(
        "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707717950973-eatabel-1.png"
      ); // 기본 이미지 설정
    }
  }, [detail.fileList]); // store.fileList가 변경될 때마다 효과를 다시 실행
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

  const containerStyle = {
    display: "flex",
    flexDirection: windowWidth > 770 ? "column" : "row",
    gap: "10px",
    flexWrap: "wrap", // 화면이 좁아질 때 이미지가 다음 줄로 넘어갈 수 있도록 설정
  };
  return (
    <Container>
      <Row>
        <Col>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <small style={{ color: "gray", marginLeft: "20px" }}>매장정보</small> */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{
                    width: "450px",
                    height: "450px",
                  }}
                />
              </div>
              <div style={containerStyle}>
                {detail.fileList && detail.fileList.length > 0 ? (
                  detail.fileList.map((file, fIndex) => (
                    <img
                      key={fIndex}
                      src={file.imageUrl}
                      alt={`Store Image ${fIndex + 1}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        cursor: "pointer",
                        marginLeft: windowWidth <= 770 ? "10px" : "0", // 화면 너비에 따라 마진 조정
                        borderRadius: "5px",
                      }}
                      onClick={() => setSelectedImage(file.imageUrl)}
                    />
                  ))
                ) : (
                  <img
                    src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707717950973-eatabel-1.png"
                    alt="Default Store Image"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>

            <Card style={{ width: "100%", maxWidth: "700px" }}>
              <Card.Title style={{ marginTop: "0px" }}></Card.Title>
              <Card.Body style={{ paddingTop: "0px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{detail.favorite}</span>
                  <span>
                    <Image
                      src="https://www.siksinhot.com/static2/images/common/bg_ico_s_click.png"
                      style={{ marginRight: "5px", marginBottom: "2px" }}
                    ></Image>
                    <span style={{ marginRight: "10px" }}>
                      {detail.viewCnt}
                    </span>
                  </span>
                </div>
                <div style={{ display: "flex" }}>
                  <h2>{detail.storeName}</h2>
                  <div style={{ marginTop: "3px" }}>
                    {" "}
                    <Image
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
                      alt="Dynamic Image"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                    />
                    {detail.averageRating ? detail.averageRating : "평가중"}
                  </div>
                </div>
                {detail.address?.area ? (
                  <div>{detail.address.area}</div>
                ) : (
                  <div>주소 정보를 불러오는 중...</div>
                )}

                <div>매장번호: {detail.storePhone}</div>
                <div>테이블 수: {detail.tableCnt}</div>
                <div>주차 : {detail.parking === "FALSE" ? "불가" : "가능"}</div>
                <div>애완동물 : {detail.dog === "FALSE" ? "불가" : "가능"}</div>
              </Card.Body>
            </Card>
            <br />
            <div>
              <div>매장예약현황</div>
              <div style={{ whiteSpace: "pre-line" }}>
                {""} 매장 웨이팅 5팀이 있습니다 {""}
              </div>
            </div>
            <DetailTab id={detail.id} />
            <br />

            <div>
              <MenuSection />
            </div>
            <div className="text-center">
              <Button
                style={{
                  fontSize: "1.5rem",
                  marginTop: "1rem",
                  width: "25rem",
                }}
                onClick={goReservation}
              >
                예약하기
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetail;
