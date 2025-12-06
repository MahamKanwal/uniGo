import React, { useEffect , useState } from "react";
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
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {useLoginUserMutation, useRegisterUserMutation } from "../../features/user/userApi";

const { Title, Text } = Typography;
const { Option } = Select;


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
    .oneOf(["male", "female", "other"], "Please select a valid gender")
    .required("Gender is required"),
  rollNo: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.required("Roll number is required"),
  }),
  department: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.required("Department is required"),
  }),
  phoneNumber: Yup.string().matches(
    /^[0-9+\-\s]+$/,
    "Please enter a valid phone number"
  ),
  guardianContact: Yup.string().matches(
    /^[0-9+\-\s]+$/,
    "Please enter a valid phone number"
  ),
  cnic: Yup.number()
    .typeError("CNIC must be a number")
    .positive("CNIC must be positive")
    .integer("CNIC must be an integer"),
  dob: Yup.date().max(new Date(), "Date of birth cannot be in the future"),
  address: Yup.string(),
  licence: Yup.string().when("role", {
    is: "driver",
    then: (schema) => schema.required("License is required"),
  }),
  policeClearance: Yup.string()
    .oneOf(["verified", "not verified"])
    .when("role", {
      is: "driver",
      then: (schema) =>
        schema
          .required("Police clearance status is required")
          .default("not verified"),
    }),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});


const AuthForm = () => {
  const { formName } = useParams();
  const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const isLogin = formName === "login";
  const isSignup = formName === "signup";
  const [selectedRole, setSelectedRole] = useState("");

  const getInitialValues = () => {
    return isLogin
      ? { email: "", password: "", remember: false }
      : {
          name: "",
          email: "",
          password: "",
          role: null,
          gender: "male",
          rollNo: "",
          department: "",
          phoneNumber: "",
          guardianContact: "",
          cnic: undefined,
          dob: null,
          address: "",
          licence: "",
          policeClearance: null,
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
            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }
            values.age = age;
        }
        
        const userData = {
            // Common required fields
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
        };
          // Add role-specific fields
        if (values.role === "student") {
            userData.rollNo = values.rollNo;
            userData.department = values.department;
            userData.phoneNumber = values.phoneNumber;
            userData.guardianContact = values.guardianContact;
            userData.cnic = values.cnic;
            userData.dob = values.dob;
            userData.gender = values.gender;
            userData.address = values.address;
          } else if (values.role === "driver") {
            userData.licence = values.licence;
            userData.policeClearance = values.policeClearance;
            userData.cnic = values.cnic;
            userData.address = values.address;
          } 

         await registerUser(userData).unwrap();
          toast.success("Account created successfully!");
          resetForm();
          setSelectedRole("");
          navigate("/login");
        }
        if (isLogin) {
          const result = await loginUser({
            email: values.email,
            password: values.password
          }).unwrap();
          
          if (result?.user) {
            toast.success("Login successful!");
            switch (result.user.role) {
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
          }
        }
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong. Please try again.");
        console.error("Error:", error);
      }
    },
  });

   useEffect(() => {
      formik.resetForm(getInitialValues());
      setSelectedRole("");
    }, [formName]);
  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    formik.setFieldValue("role", role);
    
    // Reset role-specific fields when changing role
     if (role !== "student") {
      formik.setFieldValue("gender", "");
      formik.setFieldValue("rollNo", "");
      formik.setFieldValue("department", "");
      formik.setFieldValue("phoneNumber", "");
      formik.setFieldValue("guardianContact", "");
      formik.setFieldValue("cnic", undefined);
      formik.setFieldValue("dob", null);
      formik.setFieldValue("address", "");
    }
    if (role !== "driver") {
      formik.setFieldValue("dob", null);
      formik.setFieldValue("address", "");
      formik.setFieldValue("cnic", undefined);
      formik.setFieldValue("licence", "");
      formik.setFieldValue("policeClearance", null);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-3">
      <Card
        className="w-full max-w-lg shadow-xl rounded-xl border-0"
        style={{ padding: "1.5rem" }}
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
            <Space orientation="vertical" size="middle" className="w-full">
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
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : ""
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

          {/* SIGNUP FORM */}
          {isSignup && (
            <Space orientation="vertical" size="small" className="w-full">

             {/* Row 1: Name*/}
                          <Row gutter={12}>
                            <Col span={24}>
                              <Form.Item
                                validateStatus={
                                  formik.touched.name && formik.errors.name ? "error" : ""
                                }
                                help={formik.touched.name && formik.errors.name}
                                className="!mb-3"
                              >
                                <Input
                                  prefix={<UserOutlined className="text-gray-400" />}
                                  placeholder="Full name *"
                                  name="name"
                                  value={formik.values.name}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="rounded-lg h-10"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          {/* Row 2: Email + Password*/}
                          <Row gutter={12}>
                            <Col span={12}>
                              <Form.Item
                                validateStatus={
                                  formik.touched.email && formik.errors.email ? "error" : ""
                                }
                                help={formik.touched.email && formik.errors.email}
                                className="!mb-3"
                              >
                                <Input
                                  prefix={<MailOutlined className="text-gray-400" />}
                                  placeholder="Email address *"
                                  name="email"
                                  type="email"
                                  value={formik.values.email}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="rounded-lg h-10"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                validateStatus={
                                  formik.touched.password && formik.errors.password
                                    ? "error"
                                    : ""
                                }
                                help={formik.touched.password && formik.errors.password}
                                className="!mb-3"
                              >
                                <Input.Password
                                  prefix={<LockOutlined className="text-gray-400" />}
                                  placeholder="Password ********"
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
                            </Col>
                          </Row>
            
                          {/* Row 3: Role */}
                          <Row gutter={12}>
                            <Col span={24}>
                              <Form.Item
                                validateStatus={
                                  formik.touched.role && formik.errors.role ? "error" : ""
                                }
                                help={formik.touched.role && formik.errors.role}
                                className="!mb-3"
                              >
                                <Select
                                  placeholder="Role *"
                                  value={formik.values.role}
                                  onChange={handleRoleChange}
                                  className="rounded-lg h-10"
                                >
                                  <Option value="student">Student</Option>
                                  <Option value="driver">Driver</Option>
                                  <Option value="admin">Admin</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>


                  {/* Student-specific fields */}
                  {selectedRole === "student" && (
                                 <>
                                   <Row gutter={12}>
                                     <Col span={8}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.rollNo && formik.errors.rollNo
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.rollNo && formik.errors.rollNo}
                                         className="!mb-3"
                                       >
                                         <Input
                                           prefix={<IdcardOutlined className="text-gray-400" />}
                                           placeholder="Roll No *"
                                           name="rollNo"
                                           value={formik.values.rollNo}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                     <Col span={8}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.department && formik.errors.department
                                             ? "error"
                                             : ""
                                         }
                                         help={
                                           formik.touched.department && formik.errors.department
                                         }
                                         className="!mb-3"
                                       >
                                         <Input
                                           placeholder="Department *"
                                           name="department"
                                           value={formik.values.department}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                     <Col span={8}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.gender && formik.errors.gender
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.gender && formik.errors.gender}
                                         className="!mb-3"
                                       >
                                         <Select
                                           placeholder="Gender *"
                                           value={formik.values.gender}
                                           onChange={(value) =>
                                             formik.setFieldValue("gender", value)
                                           }
                                           className="rounded-lg h-10"
                                         >
                                           <Option value="male">Male</Option>
                                           <Option value="female">Female</Option>
                                           <Option value="other">Other</Option>
                                         </Select>
                                       </Form.Item>
                                     </Col>
                                   </Row>
                 
                                   {/* Contact Information */}
                                   <Row gutter={12}>
                                     <Col span={12}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.phoneNumber &&
                                           formik.errors.phoneNumber
                                             ? "error"
                                             : ""
                                         }
                                         help={
                                           formik.touched.phoneNumber &&
                                           formik.errors.phoneNumber
                                         }
                                         className="!mb-3"
                                       >
                                         <Input
                                           prefix={<PhoneOutlined className="text-gray-400" />}
                                           placeholder="Phone number"
                                           name="phoneNumber"
                                           value={formik.values.phoneNumber}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                     <Col span={12}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.guardianContact &&
                                           formik.errors.guardianContact
                                             ? "error"
                                             : ""
                                         }
                                         help={
                                           formik.touched.guardianContact &&
                                           formik.errors.guardianContact
                                         }
                                         className="!mb-3"
                                       >
                                         <Input
                                           prefix={
                                             <ContactsOutlined className="text-gray-400" />
                                           }
                                           placeholder="Guardian contact"
                                           name="guardianContact"
                                           value={formik.values.guardianContact}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                   </Row>
                 
                                   {/* CNIC + DOB */}
                                   <Row gutter={12}>
                                     <Col span={12}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.cnic && formik.errors.cnic
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.cnic && formik.errors.cnic}
                                         className="!mb-3"
                                       >
                                         <InputNumber
                                           prefix={<IdcardOutlined className="text-gray-400" />}
                                           placeholder="CNIC (numbers only)"
                                           className="rounded-lg h-10"
                                           style={{ width: "100%" }}
                                           value={formik.values.cnic}
                                           onChange={(value) =>
                                             formik.setFieldValue("cnic", value)
                                           }
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
                                         className="!mb-3"
                                       >
                                         <DatePicker
                                           placeholder="Date of birth"
                                           className="rounded-lg w-full h-10"
                                           format="DD-MM-YYYY"
                                           value={
                                             formik.values.dob ? dayjs(formik.values.dob) : null
                                           }
                                           onChange={(date) =>
                                             formik.setFieldValue(
                                               "dob",
                                               date ? date.toISOString() : null
                                             )
                                           }
                                           onBlur={formik.handleBlur}
                                         />
                                       </Form.Item>
                                     </Col>
                                   </Row>
                 
                                   {/* Address */}
                                   <Row gutter={12}>
                                     <Col span={24}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.address && formik.errors.address
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.address && formik.errors.address}
                                         className="!mb-3"
                                       >
                                         <Input
                                           prefix={<HomeOutlined className="text-gray-400" />}
                                           placeholder="Address"
                                           name="address"
                                           value={formik.values.address}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                   </Row>
                                 </>
                               )}

                  {/* Driver-specific fields */}
                  {selectedRole === "driver" && (
                                 <>
                                   <Row gutter={12}>
                                     <Col span={12}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.licence && formik.errors.licence
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.licence && formik.errors.licence}
                                         className="!mb-3"
                                       >
                                         <Input
                                           prefix={<CarOutlined className="text-gray-400" />}
                                           placeholder="License number *"
                                           name="licence"
                                           value={formik.values.licence}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                     <Col span={12}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.policeClearance &&
                                           formik.errors.policeClearance
                                             ? "error"
                                             : ""
                                         }
                                         help={
                                           formik.touched.policeClearance &&
                                           formik.errors.policeClearance
                                         }
                                         className="!mb-3"
                                       >
                                         <Select
                                           placeholder="Police Clearance *"
                                           value={formik.values.policeClearance}
                                           onChange={(value) =>
                                             formik.setFieldValue("policeClearance", value)
                                           }
                                           className="rounded-lg h-10"
                                         >
                                           <Option value="not verified">Not Verified</Option>
                                           <Option value="verified">Verified</Option>
                                         </Select>
                                       </Form.Item>
                                     </Col>
                                   </Row>
                                   <Row gutter={12}>
                                     <Col span={12}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.cnic && formik.errors.cnic
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.cnic && formik.errors.cnic}
                                         className="!mb-3"
                                       >
                                         <InputNumber
                                           prefix={<IdcardOutlined className="text-gray-400" />}
                                           placeholder="CNIC (numbers only)"
                                           className="rounded-lg h-10"
                                           style={{ width: "100%" }}
                                           value={formik.values.cnic}
                                           onChange={(value) =>
                                             formik.setFieldValue("cnic", value)
                                           }
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
                                         className="!mb-3"
                                       >
                                         <DatePicker
                                           placeholder="Date of birth"
                                           className="rounded-lg w-full h-10"
                                           format="DD-MM-YYYY"
                                           value={
                                             formik.values.dob ? dayjs(formik.values.dob) : null
                                           }
                                           onChange={(date) =>
                                             formik.setFieldValue(
                                               "dob",
                                               date ? date.toISOString() : null
                                             )
                                           }
                                           onBlur={formik.handleBlur}
                                         />
                                       </Form.Item>
                                     </Col>
                                   </Row>
                                   <Row gutter={12}>
                                     <Col span={24}>
                                       <Form.Item
                                         validateStatus={
                                           formik.touched.address && formik.errors.address
                                             ? "error"
                                             : ""
                                         }
                                         help={formik.touched.address && formik.errors.address}
                                         className="!mb-3"
                                       >
                                         <Input
                                           prefix={<HomeOutlined className="text-gray-400" />}
                                           placeholder="Address"
                                           name="address"
                                           value={formik.values.address}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           className="rounded-lg h-10"
                                         />
                                       </Form.Item>
                                     </Col>
                                   </Row>
                                 </>
                               )}

                  {/* Terms checkbox */}
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
                          <Text className="text-sm">
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

          {/* Submit Button - Show only for login or when role is selected for signup */}
          {(isLogin || isSignup ) && (
            <Form.Item className="!mb-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLogin ? loginLoading : registerLoading}
                block
                className="h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0 font-medium"
              >
                {isLogin ? "Login" : "Create Account"}
              </Button>
            </Form.Item>
          )}

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