import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/apiRequest";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null); // State for storing registration error

  // Xác thực form bằng Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    username: Yup.string().required("Tên đăng nhập là bắt buộc"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
  });

  const handleRegister = async (values) => {
    const newUser = {
      email: values.email,
      username: values.username,
      password: values.password,
      // role: "admin",
    };

    try {
      const errorResponse = await registerUser(newUser, dispatch, navigate);
/*errorResponse.message không chứa lỗi cụ thể
Nếu errorResponse.message không có giá trị hoặc không phản ánh đúng lỗi từ server, mặc định "Email đã được sử dụng, vui lòng thử email khác." sẽ hiển thị.
Server không trả về lỗi cụ thể cho email
Nếu backend không trả về lỗi rõ ràng trong errorResponse.errors.email, nhưng vẫn có errorResponse.message, thì thông báo "Email đã được sử dụng, vui lòng thử email khác." sẽ hiển thị ngay cả khi lỗi không liên quan đến email. 
/** */ 
      if (errorResponse) {
        // xem email có looic ko
        if (errorResponse.errors && errorResponse.errors.email) {
          setRegisterError("Đã xảy ra lỗi, vui lòng thử lại.");
        } else {
          setRegisterError(errorResponse.message || "Email đã được sử dụng, vui lòng thử email khác.");
        }
      } else {
        setRegisterError(null); // Xóa mọi lỗi hiện có nếu đăng ký thành công
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setRegisterError("Lỗi máy chủ, vui lòng thử lại.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Đăng ký</h2>
        {/* Display error message at the top */}
        {registerError && (
          <div className="alert alert-danger mb-3">
            {registerError}
          </div>
        )}
        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {() => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field type="email" name="email" className="form-control" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tên đăng nhập</label>
                <Field type="text" name="username" className="form-control" />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Xác nhận mật khẩu</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Đăng ký
              </button>
              <div className="text-center mt-3">
                <span>Đã có tài khoản? </span>
                <a href="/login" className="text-decoration-none">
                  Đăng nhập
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
