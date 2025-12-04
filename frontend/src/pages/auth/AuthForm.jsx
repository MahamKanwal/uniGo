import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Select,
  Row,
  Col,
  Space,
  Divider,
  InputNumber,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  CarOutlined,
  PhoneOutlined,
  HomeOutlined,
  ContactsOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../features/user/userApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  remember: Yup.boolean(),
});

const signupSchema = Yup.object({
  name: Yup.string()
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name must be at most 50 characters")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and a number"
    )
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["student", "admin", "driver"], "Please select a valid role")
    .required("Role is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"])
    .default("male"),
  // Student specific
  rollNo: Yup.string()
    .when("role", {
      is: "student",
      then: (schema) => schema.required("Roll number is required"),
    }),
  department: Yup.string()
    .when("role", {
      is: "student",
      then: (schema) => schema.required("Department is required"),
    }),
  year: Yup.number()
    .min(1, "Year must be at least 1")
    .max(10, "Year must be at most 10")
    .when("role", {
      is: "student",
      then: (schema) => schema.required("Year is required"),
    }),
  // Driver specific
  licence: Yup.string()
    .when("role", {
      is: "driver",
      then: (schema) => schema.required("License is required"),
    }),
  policeClearance: Yup.string()
    .oneOf(["verified", "not verified"])
    .when("role", {
      is: "driver",
      then: (schema) => schema.default("not verified"),
    }),
  // Common optional fields
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s]+$/, "Please enter a valid phone number"),
  guardianContact: Yup.string()
    .matches(/^[0-9+\-\s]+$/, "Please enter a valid phone number"),
  cnic: Yup.number()
    .typeError("CNIC must be a number")
    .positive("CNIC must be positive")
    .integer("CNIC must be an integer"),
  dob: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future"),
  address: Yup.string(),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

const AuthForm = () => {
  const { formName } = useParams();
  const [addUser] = useAddUserMutation();
  const { data, isLoading } = useGetUsersQuery();
  const navigate = useNavigate();
  const isLogin = formName === "login";
  const isSignup = formName === "signup";
  const [selectedRole, setSelectedRole] = useState("student");

  const getInitialValues = () => {
    return isLogin
      ? { email: "", password: "", remember: false }
      : {
          name: "",
          email: "",
          password: "",
          role: "student",
          gender: "male",
          rollNo: "",
          department: "",
          year: 1,
          licence: "",
          policeClearance: "not verified",
          phoneNumber: "",
          guardianContact: "",
          cnic: undefined,
          dob: null,
          address: "",
          terms: false,
        };
  };

  const getValidationSchema = () => {
    return isLogin ? loginSchema : signupSchema;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isSignup) {
          // Calculate age from DOB
          if (values.dob) {
            const birthDate = new Date(values.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            values.age = age;
          }

          const userData = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
            gender: values.gender,
          };

          // Add role-specific fields
          if (values.role === "student") {
            userData.rollNo = values.rollNo;
            userData.department = values.department;
            userData.year = values.year;
          } else if (values.role === "driver") {
            userData.licence = values.licence;
            userData.policeClearance = values.policeClearance;
          }

          // Add optional fields if provided
          if (values.phoneNumber) userData.phoneNumber = values.phoneNumber;
          if (values.guardianContact) userData.guardianContact = values.guardianContact;
          if (values.cnic) userData.cnic = values.cnic;
          if (values.dob) userData.dob = values.dob;
          if (values.address) userData.address = values.address;

          await addUser(userData);
          toast.success("Account created successfully!");
          resetForm();
          navigate("/login");
        }
        if (isLogin) {
          const user = data?.find(
            (u) => u.email === values.email && u.password === values.password
          );
          if (user) {
            toast.success("Login successful!");
            switch (user.role) {
              case "admin":
                navigate("/admin/dashboard");
                break;
              case "driver":
                navigate("/driver/dashboard");
                break;
              case "student":
                navigate("/student/dashboard");
                break;
              default:
                navigate("/dashboard");
            }
          } else {
            toast.error("Invalid email or password");
          }
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    formik.resetForm(getInitialValues());
    if (formik.values.role) {
      setSelectedRole(formik.values.role);
    }
  }, [formName]);

  useEffect(() => {
    if (formik.values.role) {
      setSelectedRole(formik.values.role);
    }
  }, [formik.values.role]);

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-3">
      <Card
        className="w-full max-w-2xl shadow-xl rounded-xl border-0"
        bodyStyle={{ padding: "1.5rem" }}
      >
        <div className="text-center mb-6">
          <Title level={3} className="!mb-2 !text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </Title>
          <Text type="secondary" className="text-sm">
            {isLogin 
              ? "Enter your credentials to continue" 
              : "Join thousands of users using UniGo"}
          </Text>
        </div>

        <Form layout="vertical" onFinish={formik.handleSubmit} size="middle">
          {/* LOGIN FORM */}
          {isLogin && (
            <Space direction="vertical" size="middle" className="w-full">
              <Form.Item
                validateStatus={
                  formik.touched.email && formik.errors.email ? "error" : ""
                }
                help={formik.touched.email && formik.errors.email}
                className="!mb-3"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email address"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-lg h-10"
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formik.touched.password && formik.errors.password ? "error" : ""
                }
                help={formik.touched.password && formik.errors.password}
                className="!mb-3"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  name="password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-lg h-10"
                />
              </Form.Item>

              <Row justify="space-between" align="middle" className="!mb-4">
                <Col>
                  <Checkbox
                    name="remember"
                    checked={formik.values.remember}
                    onChange={formik.handleChange}
                  >
                    <Text className="text-sm">Remember me</Text>
                  </Checkbox>
                </Col>
                <Col>
                  <a href="/forgot-password" className="text-blue-600 text-sm">
                    Forgot password?
                  </a>
                </Col>
              </Row>
            </Space>
          )}

          {/* SIGNUP FORM - Compact Multi-line Design */}
          {isSignup && (
            <Space direction="vertical" size="small" className="w-full">
              {/* Row 1: Name + Role */}
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item
                    validateStatus={
                      formik.touched.name && formik.errors.name ? "error" : ""
                    }
                    help={formik.touched.name && formik.errors.name}
                    className="!mb-2"
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="Full name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-9"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    validateStatus={
                      formik.touched.role && formik.errors.role ? "error" : ""
                    }
                    help={formik.touched.role && formik.errors.role}
                    className="!mb-2"
                  >
                    <Select
                      placeholder="Role"
                      value={formik.values.role}
                      onChange={(value) => formik.setFieldValue("role", value)}
                      className="rounded-lg h-9"
                    >
                      <Option value="student">Student</Option>
                      <Option value="driver">Driver</Option>
                      <Option value="admin">Admin</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Row 2: Email + Gender */}
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item
                    validateStatus={
                      formik.touched.email && formik.errors.email ? "error" : ""
                    }
                    help={formik.touched.email && formik.errors.email}
                    className="!mb-2"
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Email address"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-9"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    validateStatus={
                      formik.touched.gender && formik.errors.gender ? "error" : ""
                    }
                    help={formik.touched.gender && formik.errors.gender}
                    className="!mb-2"
                  >
                    <Select
                      placeholder="Gender"
                      value={formik.values.gender}
                      onChange={(value) => formik.setFieldValue("gender", value)}
                      className="rounded-lg h-9"
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Student-specific fields */}
              {selectedRole === "student" && (
                <Row gutter={12}>
                  <Col span={8}>
                    <Form.Item
                      validateStatus={
                        formik.touched.rollNo && formik.errors.rollNo ? "error" : ""
                      }
                      help={formik.touched.rollNo && formik.errors.rollNo}
                      className="!mb-2"
                    >
                      <Input
                        prefix={<IdcardOutlined className="text-gray-400" />}
                        placeholder="Roll No"
                        name="rollNo"
                        value={formik.values.rollNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="rounded-lg h-9"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      validateStatus={
                        formik.touched.department && formik.errors.department ? "error" : ""
                      }
                      help={formik.touched.department && formik.errors.department}
                      className="!mb-2"
                    >
                      <Input
                        placeholder="Department"
                        name="department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="rounded-lg h-9"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      validateStatus={
                        formik.touched.year && formik.errors.year ? "error" : ""
                      }
                      help={formik.touched.year && formik.errors.year}
                      className="!mb-2"
                    >
                      <InputNumber
                        placeholder="Year"
                        min={1}
                        max={10}
                        className="rounded-lg w-full h-9"
                        value={formik.values.year}
                        onChange={(value) => formik.setFieldValue("year", value)}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* Driver-specific fields */}
              {selectedRole === "driver" && (
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      validateStatus={
                        formik.touched.licence && formik.errors.licence ? "error" : ""
                      }
                      help={formik.touched.licence && formik.errors.licence}
                      className="!mb-2"
                    >
                      <Input
                        prefix={<CarOutlined className="text-gray-400" />}
                        placeholder="License number"
                        name="licence"
                        value={formik.values.licence}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="rounded-lg h-9"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      validateStatus={
                        formik.touched.policeClearance && formik.errors.policeClearance ? "error" : ""
                      }
                      help={formik.touched.policeClearance && formik.errors.policeClearance}
                      className="!mb-2"
                    >
                      <Select
                        placeholder="Police Clearance"
                        value={formik.values.policeClearance}
                        onChange={(value) => formik.setFieldValue("policeClearance", value)}
                        className="rounded-lg h-9"
                      >
                        <Option value="not verified">Not Verified</Option>
                        <Option value="verified">Verified</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* Row 3: Contact Information */}
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    validateStatus={
                      formik.touched.phoneNumber && formik.errors.phoneNumber ? "error" : ""
                    }
                    help={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    className="!mb-2"
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      placeholder="Phone number"
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-9"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    validateStatus={
                      formik.touched.guardianContact && formik.errors.guardianContact ? "error" : ""
                    }
                    help={formik.touched.guardianContact && formik.errors.guardianContact}
                    className="!mb-2"
                  >
                    <Input
                      prefix={<ContactsOutlined className="text-gray-400" />}
                      placeholder="Guardian contact"
                      name="guardianContact"
                      value={formik.values.guardianContact}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-9"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Row 4: CNIC + DOB */}
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    validateStatus={
                      formik.touched.cnic && formik.errors.cnic ? "error" : ""
                    }
                    help={formik.touched.cnic && formik.errors.cnic}
                    className="!mb-2"
                  >
                    <InputNumber
                      prefix={<IdcardOutlined className="text-gray-400" />}
                      placeholder="CNIC (numbers only)"
                      className="rounded-lg w-full h-9"
                      value={formik.values.cnic}
                      onChange={(value) => formik.setFieldValue("cnic", value)}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    validateStatus={
                      formik.touched.dob && formik.errors.dob ? "error" : ""
                    }
                    help={formik.touched.dob && formik.errors.dob}
                    className="!mb-2"
                  >
                    <DatePicker
                      placeholder="Date of birth"
                      className="rounded-lg w-full h-9"
                      format="YYYY-MM-DD"
                      value={formik.values.dob ? dayjs(formik.values.dob) : null}
                      onChange={(date) =>
                        formik.setFieldValue("dob", date ? date.toDate() : null)
                      }
                      onBlur={formik.handleBlur}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Row 5: Password */}
              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item
                    validateStatus={
                      formik.touched.password && formik.errors.password ? "error" : ""
                    }
                    help={formik.touched.password && formik.errors.password}
                    className="!mb-2"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Password (min 8 characters)"
                      name="password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-9"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Row 6: Address */}
              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item
                    validateStatus={
                      formik.touched.address && formik.errors.address ? "error" : ""
                    }
                    help={formik.touched.address && formik.errors.address}
                    className="!mb-2"
                  >
                    <Input
                      prefix={<HomeOutlined className="text-gray-400" />}
                      placeholder="Address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-9"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Row 7: Terms checkbox */}
              <Row>
                <Col span={24}>
                  <Form.Item
                    validateStatus={
                      formik.touched.terms && formik.errors.terms ? "error" : ""
                    }
                    help={formik.touched.terms && formik.errors.terms}
                    className="!mb-3"
                  >
                    <Checkbox
                      name="terms"
                      checked={formik.values.terms}
                      onChange={formik.handleChange}
                    >
                      <Text className="text-xs">
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-600">
                          Terms & Conditions
                        </a>
                      </Text>
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Space>
          )}

          {/* Submit Button */}
          <Form.Item className="!mb-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              className="h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0 font-medium"
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Form.Item>

          {/* Divider */}
          <Divider className="!my-4">
            <Text type="secondary" className="text-xs">
              {isLogin ? "New to UniGo?" : "Already have an account?"}
            </Text>
          </Divider>

          {/* Switch link */}
          <div className="text-center">
            <Button
              type="link"
              href={isLogin ? "/signup" : "/login"}
              className="!px-0"
            >
              <Text className="text-blue-600 font-medium">
                {isLogin ? "Create an account" : "Login to existing account"}
              </Text>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AuthForm;