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
import { useNavigate, useParams } from "react-router-dom";

// Schema validation với Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  price: Yup.number().required("Giá là bắt buộc").positive("Giá phải là số dương"),
  discount: Yup.number().min(0, "Giảm giá phải là số dương").max(100, "Giảm giá không được vượt quá 100"),
  stock: Yup.number().required("Số lượng là bắt buộc").min(0, "Số lượng phải là số dương"),
  image: Yup.string().url("Đường dẫn ảnh không hợp lệ").required("Ảnh là bắt buộc"),
  category_id: Yup.string().required("Danh mục là bắt buộc"),
});

const FormControl = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");

        // Kiểm tra dữ liệu trả về
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data); // Nếu API bọc mảng trong `data`
        } else {
          setCategories([]); // Nếu dữ liệu sai
        }
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch sản phẩm cần sửa
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setErrorMessage("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Xóa thông báo sau 3 giây
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const formik = useFormik({
    initialValues: {
      name: product?.data?.name || "",
      price: product?.data?.price || "",
      discount: product?.data?.discount || "",
      description: product?.data?.description || "",
      stock: product?.data?.stock || "",
      image: product?.data?.image || "",
      category_id: product?.data?.category_id || "",
    },
    validationSchema,
    enableReinitialize: true, // Cập nhật giá trị khi product thay đổi
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.put(`http://localhost:3000/api/products/${id}`, values, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccessMessage("Sản phẩm đã được sửa thành công!");
        setTimeout(() => {
          navigate("/admin/products");
        }, 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) {
    return (
      <CRow className="d-flex justify-content-center align-items-center min-vh-100">
        <CCol xs={12} md={8} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CSpinner size="lg" color="primary" />
              <p>Đang tải dữ liệu sản phẩm...</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow className="d-flex justify-content-center align-items-center min-vh-100">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="fw-bold text-primary">Sửa Sản Phẩm</h2>
          </CCardHeader>
          <CCardBody>
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
            <form onSubmit={formik.handleSubmit}>
              <FormField id="name" label="Tên sản phẩm" type="text" {...formik.getFieldProps("name")} error={formik.touched.name && formik.errors.name} />
              <FormField id="price" label="Giá" type="number" {...formik.getFieldProps("price")} error={formik.touched.price && formik.errors.price} />
              <FormField id="discount" label="Giảm giá" type="number" {...formik.getFieldProps("discount")} error={formik.touched.discount && formik.errors.discount} />
              <FormField id="stock" label="Số lượng" type="number" {...formik.getFieldProps("stock")} error={formik.touched.stock && formik.errors.stock} />
              <FormField id="description" label="Mô tả" type="text" {...formik.getFieldProps("description")} error={formik.touched.description && formik.errors.description} />
              <FormField id="image" label="Hình ảnh (URL)" type="text" {...formik.getFieldProps("image")} error={formik.touched.image && formik.errors.image} />
              
              {/* Dropdown chọn danh mục */}
              <div className="mb-3">
                <label htmlFor="category_id" className="form-label">Danh mục</label>
                <CFormSelect 
                  id="category_id" 
                  {...formik.getFieldProps("category_id")} 
                  invalid={formik.touched.category_id && !!formik.errors.category_id}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
                {formik.touched.category_id && formik.errors.category_id && (
                  <div className="text-danger">{formik.errors.category_id}</div>
                )}
              </div>

              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Cập nhật sản phẩm"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
