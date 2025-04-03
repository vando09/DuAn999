import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRetweet, FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState("all"); // Danh mục đã chọn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_PRODUCTS = "http://localhost:3000/api/products";
  const API_CATEGORIES = "http://localhost:3000/api/categories";

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_PRODUCTS);
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          setError("Dữ liệu sản phẩm không hợp lệ.");
        }
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_CATEGORIES);
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setError("Dữ liệu danh mục không hợp lệ.");
        }
      } catch (err) {
        setError("Không thể tải danh sách danh mục.");
      }
    };

    fetchCategories();
  }, []);

  // Lọc sản phẩm theo danh mục đã chọn
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category_id === selectedCategory);

  return (
    <div>
      {/* Phần Sản Phẩm Nổi Bật */}
      <section className="featured spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Sản Phẩm Nổi Bật</h2>
              </div>
              <div className="featured__controls">
                <ul>
                  <li
                    className={selectedCategory === "all" ? "active" : ""}
                    onClick={() => setSelectedCategory("all")}
                  >
                    Tất cả
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={selectedCategory === category.id ? "active" : ""}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row featured__filter">
            {filteredProducts.map((product) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                <div className="featured__item">
                  <div
                    className="featured__item__pic set-bg"
                    style={{ backgroundImage: `url(${product.image})` }}
                  >
                    <ul className="featured__item__pic__hover">
                      <li>
                        <Link to="#">
                          <FaHeart />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <FaRetweet />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <FaShoppingCart />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="featured__item__text">
                    <h6>
                      <Link to="#">{product.name}</Link>
                    </h6>
                    {/* <h5
                      className="mt-2 text-truncate"
                      style={{ maxWidth: "90%" }}
                    >
                      {product.name}
                    </h5> */}
                    <strong className="product-price">
                      {product.price
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                            .format(product.price)
                            .replace("₫", "VND")
                        : "Liên hệ"}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="from-blog spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title from-blog__title">
                <h2>Tin Tức Mới Nhất</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {[1, 2, 3].map((item) => (
              <div className="col-lg-4 col-md-4 col-sm-6" key={item}>
                <div className="blog__item">
                  <div className="blog__item__pic">
                    <img src={`img/blog/blog-${item}.jpg`} alt="" />
                  </div>
                  <div className="blog__item__text">
                    <ul>
                      <li>
                        <i className="fa fa-calendar-o"></i> 4 Tháng 5, 2019
                      </li>
                      <li>
                        <i className="fa fa-comment-o"></i> 5
                      </li>
                    </ul>
                    <h5>
                      <Link to="#">Mẹo nấu ăn giúp việc nấu ăn trở nên đơn giản</Link>
                    </h5>
                    <p>Sed quia non numquam modi tempora indunt ut labore et dolore magnam aliquam quaerat </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
