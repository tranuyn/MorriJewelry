import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import InputCpn from "./inputComponent";
import ProductForm from "./ProductForm";
import CachedIcon from "@mui/icons-material/Cached";
interface Staff {
  id: string;
  username: string;
  email: string;
  name: string;
  phoneNumber: string;
  cccd: string;
  role: string;
}
interface FormProductData {
  id: string;
  name: string;
  code: string;
  description: string;
  material: string;
  sellingPrice: number;
  costPrice: number;
  imageUrl: string[];
  loaiSanPham: string;
  quantity: number;
  weight: number;
  chiPhiPhatSinh: number;
  enteredQuantity: number;
}

const CreateEI: React.FC = () => {
  const [formCount, setFormCount] = useState<number>(1);
  const [inventoryStaff, setInventoryStaff] = useState<Staff[]>([]);
  const [isSupplierExist, setIsSupplierExist] = useState(false);
  const [formProductData, setProductFormData] = useState<FormProductData[]>([
    {
      id: "",
      name: "",
      code: "",
      description: "",
      material: "",
      sellingPrice: 0,
      costPrice: 0,
      imageUrl: [],
      loaiSanPham: "",
      quantity: 0,
      weight: 0,
      chiPhiPhatSinh: 0,
      enteredQuantity: 1,
    },
  ]);

  const [formData, setFormData] = useState({
    supplierId: "",
    supplierPhone: "",
    supplierName: "",
    supplierAddress: "",
    staffId: "",
    staffName: "",
    staffEmail: "",
    staffPhone: "",
    dateEnter: "",
    totalValue: "",
    note: "",
  });
  const hasMounted = useRef(false);

  const removeForm = (indexToRemove: number) => {
    if (formProductData.length <= 1) return;

    setProductFormData((prevData) => {
      // Remove the form at index-1 (because form indices start at 1)
      const actualIndex = indexToRemove - 1;
      return prevData.filter((_, index) => index !== actualIndex);
    });

    setFormCount((prev) => prev - 1);
  };

  // const removeForm = (index: number) => {
  //   if (productForms.length === 0) return;
  //   setProductForms((prevForms) => {
  //     const updatedForms = prevForms.filter(
  //       (form) => form.props.index !== index
  //     );
  //     return updatedForms;
  //   });
  //   console.log("trc khi xoa " + formProductData);
  //   setProductFormData((prevData) =>
  //     prevData.filter((_, i) => i !== index - 1)
  //   );
  //   console.log("sau khi xoa " + formProductData);
  // };

  const addProductForm = () => {
    setProductFormData((prevData) => [
      ...prevData,
      {
        id: "",
        name: "",
        code: "",
        description: "",
        material: "",
        sellingPrice: 0,
        costPrice: 0,
        imageUrl: [],
        loaiSanPham: "",
        quantity: 0,
        weight: 0,
        chiPhiPhatSinh: 0,
        enteredQuantity: 1,
      },
    ]);
    setFormCount((prev) => prev + 1);
  };
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true; // Set to true after first render
    } else {
      const newForm = (
        <ProductForm
          index={formCount}
          key={formCount}
          addProductForm={addProductForm}
          removeForm={removeForm}
          formProductData={{
            id: "",
            name: "",
            code: "",
            description: "",
            material: "",
            sellingPrice: 0,
            costPrice: 0,
            imageUrl: [],
            loaiSanPham: "",
            quantity: 0,
            weight: 0,
            chiPhiPhatSinh: 0,
            enteredQuantity: 1,
          }} // Truyền dữ liệu cho form mới
          setProductFormData={setProductFormData}
        />
      );
    }
  }, [formCount]);
  useEffect(() => {
    console.log("Updated productForms:", formProductData);
  }, [formProductData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getStaff = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8081/user/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Staff[] = await response.json();
      const inventoryStaff = data.filter(
        (staff) => staff.role === "INVENTORY_STAFF"
      );
      setInventoryStaff(inventoryStaff);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    getStaff();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const staffId = event.target.value;
    const staff1 = inventoryStaff.find((s) => s.id === staffId) || null;

    if (staff1) {
      setFormData((prevData) => ({
        ...prevData,
        staffId: staff1.id,
        staffName: staff1.name,
        staffEmail: staff1.email,
        staffPhone: staff1.phoneNumber, // Đảm bảo đúng tên khóa
      }));
    }
  };

  const handleReloadClick = () => {
    if (formData.supplierPhone) {
      fetchInfo(formData.supplierPhone);
    }
  };

  const fetchInfo = async (phone: string) => {
    try {
      const response = await fetch(
        `http://localhost:8081/supplier/getSupplierByPhone/${phone}`
      );
      if (!response.ok) {
        setIsSupplierExist(false);
        throw new Error("Không thể lấy dữ liệu");
      }
      const data = await response.json();
      setIsSupplierExist(true);
      setFormData((prevData) => ({
        ...prevData,
        supplierId: data.id,
        supplierPhone: data.supplierPhone,
        supplierName: data.supplierName,
        supplierAddress: data.supplierAddress,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="enter-inventory-page">
      <div className="threeForm">
        <form className="formEnterContainer">
          <div className="formTitleE">Thông tin nhà cung cấp</div>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <InputCpn
              title={
                isSupplierExist
                  ? "Số điện thoại - đã lưu"
                  : "Số điện thoại - chưa lưu (mới)"
              }
              name="supplierPhone"
              type="tel"
              placehoder="số điện thoại"
              pattern="[0-9]*"
              maxLength={10}
              value={formData.supplierPhone}
              onChange={handleInputChange}
            />
            <div
              className="CachedIconContainer1"
              onClick={() => handleReloadClick()}
            >
              <CachedIcon sx={{ color: "#08B5FA" }} />
            </div>
          </div>

          <InputCpn
            title="Tên nhà cung cấp"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleInputChange}
          />
          <InputCpn
            title="Địa chỉ nhà cung cấp"
            name="supplierAddress"
            value={formData.supplierAddress}
            onChange={handleInputChange}
          />
        </form>
        <form className="formEnterContainer">
          <div className="formTitleE">Thông tin nhân viên nhập kho</div>
          <div className="input-containerE">
            <label className="input-labelE">Họ tên nhân viên</label>
            <select
              className="input-fieldE"
              defaultValue=""
              onChange={handleSelectChange}
            >
              <option value="" disabled>
                Chọn nhân viên
              </option>
              {inventoryStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

          <InputCpn
            title="Email nhân viên"
            name="emailStaff"
            value={formData.staffEmail}
            disabled={true}
          />
          <InputCpn
            title="Số điện thoại"
            name="staffPhone"
            value={formData.staffPhone}
            disabled={true}
          />
        </form>
        <form className="formEnterContainer">
          <div className="formTitleE">Thông tin phiếu nhập kho</div>
          <InputCpn title="Ngày nhập" name="dateEnter" type="date" />
          <InputCpn title="Tổng giá trị phiếu" type="tel" name="ivtrValue" />
          <InputCpn title="Ghi chú" name="note" />
        </form>
      </div>

      <div className="twoForm">
        {formProductData.map((data, arrayIndex) => (
          <ProductForm
            key={`product-form-${arrayIndex}`}
            index={arrayIndex + 1}
            addProductForm={addProductForm}
            removeForm={removeForm}
            formProductData={data}
            setProductFormData={setProductFormData}
          />
        ))}
      </div>
    </div>
  );
};
export default CreateEI;
