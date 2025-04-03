import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { FaHeart, FaRetweet, FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <section className="blog spad">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-4 col-md-5">
            <aside className="blog__sidebar">
              <div className="blog__sidebar__search">
                <form>
                  <input type="text" placeholder="Tìm kiếm..." />
                  <button type="submit">
                    <span className="icon_search"></span>
                  </button>
                </form>
              </div>
              <div className="blog__sidebar__item">
                <h4>Danh mục</h4>
                <ul>
                  <li
                    className={selectedCategory === "all" ? "active" : ""}
                    onClick={() => setSelectedCategory("all")}
                    style={{ cursor: "pointer" }} // ✅ Fix lỗi không dùng <a href="#">
                  >
                    Tất cả
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={selectedCategory === category.id ? "active" : ""}
                      onClick={() => setSelectedCategory(category.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* Products List */}
          <div className="col-lg-8 col-md-7">
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                    <div className="featured__item">
                      <div
                        className="featured__item__pic set-bg"
                        style={{
                          backgroundImage: `url(${product.image || "/default-image.jpg"})`, // ✅ Thêm ảnh mặc định
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/productdetail/${product.id}`)}
                      >
                        <ul className="featured__item__pic__hover">
                          {/* <li>
                            <button className="btn btn-link p-0">
                              <FaHeart />
                            </button>
                          </li> */}
                          {/* <li>
                            <button
                              onClick={() => navigate(`/productdetail/${product.id}`)}
                              className="btn btn-link p-0"
                            >
                              <FaRetweet />
                            </button>
                          </li> */}
                          {/* <li>
                            <button className="btn btn-link p-0">
                              <FaShoppingCart />
                            </button>
                          </li> */}
                        </ul>
                      </div>
                      <div className="featured__item__text">
                        <h6 className="mt-2 text-truncate" style={{ maxWidth: "200px" }}>
                          <Link to={`/productdetail/${product.id}`}>{product.name}</Link>
                        </h6>
                        {/* <h5 className="mt-2 text-truncate" style={{ maxWidth: "200px" }}>
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
                ))
              ) : (
                <p>Không có sản phẩm nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
