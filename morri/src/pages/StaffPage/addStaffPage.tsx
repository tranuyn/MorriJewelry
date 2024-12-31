import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import TextBox from "../../component/TextBox/TextBox";
import BtnComponent from "../../component/BtnComponent/BtnComponent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import WorkIcon from '@mui/icons-material/Work';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CardIcon from '@mui/icons-material/CardMembership';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

interface StaffFormProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddStaffForm: React.FC<StaffFormProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 6,
          borderRadius: 2,
          width: "90%",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "#264850",
            textAlign: "center",
          }}
        >
          Thêm nhân viên
        </div>

        <Box sx={{ display: "flex" }}>
          {/* Left side - Avatar section */}
          <Box sx={{ 
            width: "200px",
            marginRight: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}>
            <Box sx={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              marginLeft: "20px",
              overflow: "hidden"
            }}>
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ width: "100%", height: "100%", backgroundColor: "#E0E0E0" }} />
              )}
            </Box>
            <label htmlFor="upload-photo">
              <input
                style={{ display: "none" }}
                id="upload-photo"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor: "#264850",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginBottom: "30px",
                  marginTop: "10px",
                  width: "130px",
                  marginLeft: "30px",
                }}
                onClick={() => document.getElementById("upload-photo")?.click()}
              >
                <PhotoCameraIcon style={{ fontSize: "20px" }} />
                Chọn ảnh
              </button>
            </label>
            <Box sx={{ width: "100%", marginBottom: "10px" }}>
              <TextBox
                datatype="date"
                title="Ngày sinh"
                placeholder="02/11/2004"
                onChange={(value) => {}}
                icon={<CakeIcon style={{ color: "black" }} />}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextBox
                datatype="date"
                title="Ngày vào làm"
                placeholder="02/11/2024"
                onChange={(value) => {}}
                icon={<WorkIcon style={{ color: "black" }} />}
              />
            </Box>
          </Box>

          {/* Right side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "8px"
            }}>
              <TextBox
                datatype="string"
                title="Tên"
                placeholder="Nhập tên nhân viên"
                onChange={(value) => {}}
              />
              <TextBox
                datatype="string"
                title="CCCD"
                placeholder="Nhập CCCD"
                onChange={(value) => {}}
                icon={<CardIcon style={{ color: "black" }} />}
              />
            </Box>

            <Box sx={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "8px"
            }}>
              <TextBox
                datatype="string"
                title="Email"
                placeholder="Nhập Email"
                onChange={(value) => {}}
                icon={<EmailIcon style={{ color: "black" }} />}
              />
              <TextBox
                datatype="string"
                title="SDT"
                placeholder="Nhập SDT"
                onChange={(value) => {}}
                icon={<PhoneIcon style={{ color: "black" }} />}
              />
            </Box>

            <Box sx={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "8px"
            }}>
              <TextBox
                datatype="select"
                title="Chức vụ"
                placeholder="Chọn chức vụ"
                onChange={(value) => {}}
                options={[
                  { label: "Nhân viên", value: "staff" },
                ]}
              />
              <TextBox
                datatype="select"
                title="Giới tính"
                placeholder="Chọn giới tính"
                onChange={(value) => {}}
                options={[
                  { label: "Nam", value: "male" },
                  { label: "Nữ", value: "female" },
                ]}
                icon={<PersonIcon style={{ color: "black" }} />}
              />
            </Box>

            <TextBox
              datatype="string"
              title="Địa chỉ"
              placeholder="Nhập địa chỉ"
              onChange={(value) => {}}
              icon={<LocationOnIcon style={{ color: "black" }} />}
            />
          </Box>
        </Box>

        <Box sx={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: "16px", 
          marginTop: "24px"
        }}>
          <BtnComponent
            btnColorType="primary"
            btnText="Lưu"
            onClick={() => {}}
          />
          <BtnComponent
            btnColorType="close"
            btnText="Đóng"
            onClick={() => setIsModalOpen(false)}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default AddStaffForm;