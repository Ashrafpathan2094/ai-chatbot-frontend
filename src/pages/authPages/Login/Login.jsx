// src/components/Login/Login.jsx
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import styles from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Formik form handler
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          {
            ...values,
          }
        );

        // Store token and user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Navigate to home or dashboard
        navigate("/chat");
      } catch (err) {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
        console.error("Login error:", err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Login</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`${styles.formInput} ${
                formik.touched.email && formik.errors.email
                  ? styles.inputError
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.errorText}>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`${styles.formInput} ${
                formik.touched.password && formik.errors.password
                  ? styles.inputError
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.errorText}>{formik.errors.password}</div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className={styles.submitButton}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
