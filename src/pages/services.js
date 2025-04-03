import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Services = () => {
    return (
        <div>
            {/* Phần mở đầu */}
            <div className="hero">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5">
                            <div className="intro-excerpt">
                                <h1>Dịch Vụ</h1>
                                <p className="mb-4">
                                    Chúng tôi cung cấp những chiếc đồng hồ tinh tế, đẳng cấp với chất lượng tuyệt vời.
                                    Khám phá ngay bộ sưu tập của chúng tôi!
                                </p>
                                <p>
                                    <a href="/" className="btn btn-secondary me-2">Mua Ngay</a>
                                    <a href="/" className="btn btn-white-outline">Khám Phá</a>
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="hero-img-wrap">
                                <img src="images/watch-banner.png" alt="Đồng Hồ Cao Cấp" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lý do chọn chúng tôi */}
            <div className="why-choose-section">
                <div className="container">
                    <div className="row my-5">
                        {[
                            { img: "images/truck.svg", title: "Giao Hàng Nhanh Chóng" },
                            { img: "images/bag.svg", title: "Mua Sắm Dễ Dàng" },
                            { img: "images/support.svg", title: "Hỗ Trợ 24/7" },
                            { img: "images/return.svg", title: "Đổi Trả Linh Hoạt" }
                        ].map((feature, index) => (
                            <div key={index} className="col-6 col-md-6 col-lg-3 mb-4">
                                <div className="feature">
                                    <div className="icon">
                                        <img src={feature.img} alt={feature.title} className="img-fluid" />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bộ Sưu Tập Đồng Hồ */}
            <div className="product-section pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                            <h2 className="mb-4 section-title">Chế tác từ vật liệu cao cấp.</h2>
                            <p className="mb-4">Khám phá những mẫu đồng hồ sang trọng, mang đến sự đẳng cấp cho bạn.</p>
                            <p><a href="/" className="btn">Khám Phá</a></p>
                        </div>
                        {[
                            { img: "images/watch-1.png", title: "Đồng Hồ Cổ Điển", price: "5,000,000₫" },
                            { img: "images/watch-2.png", title: "Đồng Hồ Hiện Đại", price: "7,800,000₫" },
                            { img: "images/watch-3.png", title: "Đồng Hồ Thể Thao", price: "4,300,000₫" }
                        ].map((product, index) => (
                            <div key={index} className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                                <a className="product-item" href="/">
                                    <img src={product.img} alt={product.title} className="img-fluid product-thumbnail" />
                                    <h3 className="product-title">{product.title}</h3>
                                    <strong className="product-price">{product.price}</strong>
                                    <span className="icon-cross">
                                        <img src="images/cross.svg" alt="Remove" className="img-fluid" />
                                    </span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Phản Hồi Khách Hàng */}
            <div className="testimonial-section before-footer-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 mx-auto text-center">
                            <h2 className="section-title">Khách Hàng Nói Gì?</h2>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="testimonial-slider-wrap text-center">
                                <div id="testimonial-nav">
                                    <span className="prev" data-controls="prev"><FaChevronLeft /></span>
                                    <span className="next" data-controls="next"><FaChevronRight /></span>
                                </div>
                                <div className="testimonial-slider">
                                    {[
                                        { name: "Nguyễn Văn A", position: "Doanh Nhân", img: "images/person-1.png" },
                                        { name: "Trần Thị B", position: "Chuyên Gia Thời Trang", img: "images/person-2.png" }
                                    ].map((testimonial, index) => (
                                        <div key={index} className="item">
                                            <div className="row justify-content-center">
                                                <div className="col-lg-8 mx-auto">
                                                    <div className="testimonial-block text-center">
                                                        <blockquote className="mb-5">
                                                            <p>&ldquo;Chiếc đồng hồ tôi mua tại đây thực sự tuyệt vời, thiết kế sang trọng và chất lượng rất tốt!&rdquo;</p>
                                                        </blockquote>
                                                        <div className="author-info">
                                                            <div className="author-pic">
                                                                <img src={testimonial.img} alt={testimonial.name} className="img-fluid" />
                                                            </div>
                                                            <h3 className="font-weight-bold">{testimonial.name}</h3>
                                                            <span className="position d-block mb-3">{testimonial.position}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
