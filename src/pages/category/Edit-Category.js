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
} from "@coreui/react";
import FormField from "./FormField";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("Tên danh mục là bắt buộc"),
  slug: Yup.string().required("Slug là bắt buộc"),
});

const EditCategoryForm = () => {
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/categories/${id}`);
        setCategory(response.data);
      } catch (error) {
        setErrorMessage("Không thể tải dữ liệu danh mục.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);
// console.log(category.data.name);

  const formik = useFormik({
    initialValues: {
      name: category?.data?.name ?? "", // Dùng `??` để tránh lỗi undefined
      slug: category?.data?.slug ?? "",
    },
    validationSchema,
    enableReinitialize: true, // Bật chế độ cập nhật lại giá trị khi props thay đổi
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.put(`http://localhost:3000/api/categories/${id}`, values, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccessMessage("Danh mục đã được sửa thành công!");
        setTimeout(() => {
          navigate("/admin/categories");
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
              <p>Đang tải dữ liệu danh mục...</p>
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
            <h2 className="fw-bold text-primary">Sửa Danh Mục</h2>
          </CCardHeader>
          <CCardBody>
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
            <form onSubmit={formik.handleSubmit}>
              <FormField id="name" label="Tên danh mục" type="text" {...formik.getFieldProps("name")} error={formik.touched.name && formik.errors.name} />
              <FormField id="slug" label="Slug" type="text" {...formik.getFieldProps("slug")} error={formik.touched.slug && formik.errors.slug} />
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Cập nhật danh mục"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditCategoryForm;
