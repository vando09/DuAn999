import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { loginSuccess } from "../redux/authSlide";
import { CButton } from "@coreui/react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // For related products
  const user = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${id}`
        );
        console.log("Chi tiết sản phẩm:", response.data);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
          // Assuming the product data includes category_id or another property
          fetchRelatedProducts(response.data.data.category_id);
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        setError("Không thể tải chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products?category_id=${categoryId}`
        );
        if (response.data && response.data.data) {
          setRelatedProducts(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", err);
      }
    };

    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("authUser"));
    const token = localStorage.getItem("authToken");
    if (savedUser && token) {
      dispatch(loginSuccess(savedUser));
    }
  }, [dispatch]);

  const handleAddToCart = (product_id, user_id) => {
    if (!product_id) {
      alert("Sản phẩm không hợp lệ.");
      return;
    }

    if (!user_id) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    dispatch(addToCart({ productId: product_id, userId: user_id }))
      .unwrap()
      .then(() => {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
        navigate(`/cart/${user_id}`);
      })
      .catch((error) => {
        alert(error.message || "Lỗi khi thêm sản phẩm vào giỏ hàng.");
      });
  };

  if (loading) {
    return <p className="text-center">Đang tải chi tiết sản phẩm...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  const productList = Array.isArray(product) ? product : [product];

  return (
    <section className="product-details spad">
    <br></br>
      <div className="container">
        {productList.map((item) => (
          <div className="row" key={item.id}>
            <div className="col-lg-6 col-md-6">
              <div className="product__details__pic">
                {item.image ? (
                  <div className="product__details__pic__item">
                    <img
                      className="product__details__pic__item--large"
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-center p-5">Không có hình ảnh.</p>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="product__details__text">
                <h3>{item.name}</h3>
                <strong className="product-price fs-4">
                  {item.price
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                        .format(item.price)
                        .replace("₫", "VND")
                    : "Liên hệ"}
                </strong>
                <p>{item.description}</p>
                <div className="mt-4">
                  <CButton
                    style={{
                      backgroundColor: "#7fad39",
                      borderColor: "#7fad39",
                      color: "white",
                    }}
                    className="me-2"
                    onClick={() => handleAddToCart(item.id, user?.id)}
                  >
                    Thêm vào giỏ hàng
                  </CButton>
                  <CButton
                    style={{
                      backgroundColor: "#7fad39",
                      borderColor: "#7fad39",
                      color: "white",
                    }}
                    onClick={() => navigate(`/cart/${user?.id || "guest"}`)}
                  >
                    Mua ngay
                  </CButton>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Related Products Section */}
        <div className="related-products mt-5">
       
          <h3>Sản phẩm liên quan</h3>
          <br></br><br></br>
          <div className="row">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedItem) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={relatedItem.id}>
                  <div className="product-card">
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <h5>{relatedItem.name}</h5>
                    <p>
                      {relatedItem.price
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                            .format(relatedItem.price)
                            .replace("₫", "VND")
                        : "Liên hệ"}
                    </p>
                    <CButton
                      style={{
                        backgroundColor: "#7fad39",
                        borderColor: "#7fad39",
                        color: "white",
                      }}
                      onClick={() => handleAddToCart(relatedItem.id, user?.id)}
                    >
                      Thêm vào giỏ hàng
                    </CButton>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Không có sản phẩm liên quan.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
