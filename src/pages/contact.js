import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Liên hệ</h1>
                <p className="mb-4">
                  Hãy liên hệ với chúng tôi để được hỗ trợ. Chúng tôi luôn sẵn
                  sàng giúp đỡ bạn một cách nhanh chóng và hiệu quả nhất.
                </p>
                <p>
                  <a href="/shop" className="btn btn-secondary me-2">
                    Mua ngay
                  </a>
                  <a href="/explore" className="btn btn-outline-secondary">
                    Khám phá
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
        </div>
      </div>

      {/* Phần Liên Hệ */}
      <div className="untree_co-section">
        <div className="container">
          <div className="block">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-8 pb-4">
                <div className="row mb-5">
                  <div className="col-lg-4">
                    <div className="service no-shadow align-items-center link horizontal d-flex active">
                      <div className="service-icon color-1 mb-4">
                        <FaMapMarkerAlt size={24} />
                      </div>
                      <div className="service-contents">
                        <p>43 Raymouth Rd, Baltimore, London 3910</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service no-shadow align-items-center link horizontal d-flex active">
                      <div className="service-icon color-1 mb-4">
                        <FaEnvelope size={24} />
                      </div>
                      <div className="service-contents">
                        <p>info@yourdomain.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service no-shadow align-items-center link horizontal d-flex active">
                      <div className="service-icon color-1 mb-4">
                        <FaPhoneAlt size={24} />
                      </div>
                      <div className="service-contents">
                        <p>+1 294 3925 3939</p>
                      </div>
                    </div>
                  </div>
                </div>

                <form>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label className="text-black" htmlFor="firstName">
                          Họ
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label className="text-black" htmlFor="lastName">
                          Tên
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="text-black" htmlFor="email">
                      Địa chỉ Email
                    </label>
                    <input type="email" className="form-control" id="email" />
                  </div>
                  <div className="form-group mb-5">
                    <label className="text-black" htmlFor="message">
                      Tin nhắn
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      cols={30}
                      rows={5}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
