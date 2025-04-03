import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CFormSelect,
} from "@coreui/react";
import FormField from "./FormField";
import { useNavigate } from "react-router-dom";

// Schema kiểm tra dữ liệu nhập vào
const validationSchema = Yup.object({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  price: Yup.number().required("Giá là bắt buộc").positive("Giá phải là số dương"),
  discount: Yup.number().min(0, "Giảm giá phải là số dương").max(100, "Giảm giá không được vượt quá 100"),
  stock: Yup.number().required("Số lượng là bắt buộc").min(0, "Số lượng phải là số dương"),
  image: Yup.string().url("Đường dẫn ảnh không hợp lệ").required("Ảnh là bắt buộc"),
  category_id: Yup.string().required("Danh mục là bắt buộc"),
});

const FormControl = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Gọi API lấy danh mục sản phẩm
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/categories")
      .then((response) => {
        console.log("🔹 Categories API Response:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data); // ✅ Đảm bảo lấy đúng danh mục
        } else {
          console.error("⚠ API không trả về danh mục hợp lệ");
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy danh mục:", error);
        setCategories([]);
      });
  }, []);

  // Tự động ẩn thông báo sau 3 giây
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Khởi tạo form với Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      discount: "",
      description: "",
      stock: "",
      image: "",
      category_id: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const productData = {
        ...values,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      try {
        await axios.post("http://localhost:3000/api/products", productData);
        setSuccessMessage("Sản phẩm đã được thêm thành công!");
        setTimeout(() => {
          resetForm();
          navigate("/admin/products");
        }, 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <CRow className="d-flex justify-content-center align-items-center min-vh-100">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="fw-bold text-primary">Thêm Sản Phẩm</h2>
          </CCardHeader>
          <CCardBody>
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
            <form onSubmit={formik.handleSubmit}>
              <FormField
                id="name"
                label="Tên sản phẩm"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
              />
              <FormField
                id="price"
                label="Giá"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price ? formik.errors.price : ""}
              />
              <FormField
                id="discount"
                label="Giảm giá"
                type="number"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.discount && formik.errors.discount ? formik.errors.discount : ""}
              />
              <FormField
                id="stock"
                label="Số lượng"
                type="number"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock && formik.errors.stock ? formik.errors.stock : ""}
              />
              <FormField
                id="description"
                label="Mô tả"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description ? formik.errors.description : ""}
              />
              {/* Dropdown chọn danh mục */}
              <CFormSelect
                id="category_id"
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.category_id && formik.touched.category_id ? "is-invalid" : ""}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </CFormSelect>
              {formik.errors.category_id && formik.touched.category_id && (
                <div className="text-danger">{formik.errors.category_id}</div>
              )}

              <FormField
                id="image"
                label="Hình ảnh (URL)"
                type="text"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.image && formik.errors.image ? formik.errors.image : ""}
              />

              
              <CButton type="submit" color="black" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Thêm sản phẩm"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
