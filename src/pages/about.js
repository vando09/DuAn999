import React from "react";
import { FaListUl, FaTh } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const About = () => {
  return (
    <div>
      {/* Phần Giới thiệu */}
      <div className="hero">
        <Container>
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Về Chúng Tôi</h1>
                <p className="mb-4">
                  Chúng tôi mang đến những sản phẩm chất lượng với dịch vụ tốt
                  nhất. Khám phá ngay để biết thêm về chúng tôi!
                </p>
                <p>
                  <a href="#" className="btn btn-secondary me-2">
                    Mua Ngay
                  </a>
                  <a href="#" className="btn btn-white-outline">
                    Khám Phá
                  </a>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap">
                <img src="images/couch.png" className="img-fluid" alt="Sofa" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Phần Vì Sao Chọn Chúng Tôi */}
      <div className="why-choose-section">
        <Container>
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title">Vì Sao Chọn Chúng Tôi?</h2>
              <p>
                Chúng tôi cam kết mang lại chất lượng tốt nhất với dịch vụ hoàn
                hảo dành cho khách hàng.
              </p>

              <div className="row my-5">
                {[
                  { src: "images/truck.svg", title: "Giao Hàng Nhanh & Miễn Phí" },
                  { src: "images/bag.svg", title: "Mua Sắm Dễ Dàng" },
                  { src: "images/support.svg", title: "Hỗ Trợ 24/7" },
                  { src: "images/return.svg", title: "Đổi Trả Dễ Dàng" },
                ].map((feature, index) => (
                  <div key={index} className="col-6 col-md-6">
                    <div className="feature">
                      <div className="icon">
                        <img src={feature.src} alt={feature.title} className="img-fluid" />
                      </div>
                      <h3>{feature.title}</h3>
                      <p>
                        Chúng tôi luôn nỗ lực mang đến sự hài lòng và trải nghiệm
                        tốt nhất cho khách hàng.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="img-wrap">
                <img
                  src="images/why-choose-us-img.jpg"
                  alt="Vì Sao Chọn Chúng Tôi"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Phần Đội Ngũ */}
      <div className="untree_co-section">
        <Container>
          <div className="row mb-5">
            <div className="col-lg-5 mx-auto text-center">
              <h2 className="section-title">Đội Ngũ Của Chúng Tôi</h2>
            </div>
          </div>

          <div className="row">
            {[
              { name: "Lawson Arnold", src: "images/person_1.jpg" },
              { name: "Jeremy Walker", src: "images/person_2.jpg" },
              { name: "Patrik White", src: "images/person_3.jpg" },
              { name: "Kathryn Ryan", src: "images/person_4.jpg" },
            ].map((member, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3 mb-5 mb-md-0">
                <img src={member.src} className="img-fluid mb-5" alt={member.name} />
                <h3>
                  <a href="#">
                    <span>{member.name.split(" ")[0]}</span> {member.name.split(" ")[1]}
                  </a>
                </h3>
                <span className="d-block position mb-4">CEO, Người Sáng Lập</span>
                <p>
                  Những con người tận tâm luôn sẵn sàng mang đến những sản phẩm tốt
                  nhất cho bạn.
                </p>
                <p className="mb-0">
                  <a href="#" className="more dark">
                    Tìm Hiểu Thêm <span className="icon-arrow_forward"></span>
                  </a>
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default About;
