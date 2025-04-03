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
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  content: Yup.string().required("Nội dung là bắt buộc"),
  image: Yup.string().url("Đường dẫn ảnh không hợp lệ").required("Ảnh là bắt buộc"),
});

const EditPost = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        setErrorMessage("Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  console.log(post.data.name);

  // Ensure Formik is initialized only after post data is loaded
  const formik = useFormik({
    initialValues: {
      title: post?.data?.title ?? "",
      content: post?.data?.content ?? "",
      image: post?.data?.image ?? "",
      updated_at: new Date().toISOString(),
    },
    validationSchema,
    enableReinitialize: true, // This ensures Formik re-initializes when post data is available
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.put(`http://localhost:3000/api/posts/${id}`, values, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccessMessage("Bài viết đã được cập nhật thành công!");
        setTimeout(() => {
          navigate("/admin/posts");
        }, 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
  });

  // Return a loading spinner while fetching post data
  if (loading || !post) return <CSpinner size="sm" />;

  return (
    <CRow className="d-flex justify-content-center align-items-center min-vh-100">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="fw-bold text-primary">Chỉnh Sửa Bài Viết</h2>
          </CCardHeader>
          <CCardBody>
            {successMessage && (
              <CAlert color="success">{successMessage}</CAlert>
            )}
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
            <form onSubmit={formik.handleSubmit}>
              <FormField
                id="title"
                label="Tiêu đề"
                type="text"
                {...formik.getFieldProps("title")}
                error={formik.touched.title && formik.errors.title}
              />
              <FormField
                id="content"
                label="Nội dung"
                type="text"
                {...formik.getFieldProps("content")}
                error={formik.touched.content && formik.errors.content}
              />
              <FormField
                id="image"
                label="Hình ảnh (URL)"
                type="text"
                {...formik.getFieldProps("image")}
                error={formik.touched.image && formik.errors.image}
              />
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Cập nhật bài viết"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditPost;
