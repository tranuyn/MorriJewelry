import React, { useState, useEffect } from "react";
import "./service.css";
import Header from "../../component/Title_header/Header";
import TabBar from "../../component/Tabbar/TabBar";
import { Box } from "@mui/material";
import SearchComponent from "../../component/SearchComponent/SearchComponent";
import BtnComponent from "../../component/BtnComponent/BtnComponent";
import DeleteComponent from "../../component/DeleteComponent/DeleteComponent";
import DynamicAddForm from "./dynamicAddForm";
import DynamicUpdateForm from "./dynamicUpdateForm";
import ServiceComponent from "../../component/ServiceComponent/ServiceComponent";
import TableComponent from "../../component/TableComponent/TableComponent";

export interface Service {
  id: string;
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string | null;
  price: number | null;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  avaURL: string;
}

interface ServiceBooking {
  nameService: string;
  customerName: string;
  customerPhone: string;
  services: { serviceName: string; quantity: number }[];
  description: string;
  staffLapHoaDon: Staff | null;
  totalPrice: number;
  createdAt: string;
  deliverystatus: string;
  deliveryDate: string;
}

const bookingColumns = [
  { field: "customerName", headerName: "Tên khách hàng" },
  { field: "createdAt", headerName: "Ngày tạo" },
  { field: "deliveryDate", headerName: "Ngày giao" },
  { field: "deliverystatus", headerName: "Trạng thái" },
  { field: "quantity", headerName: "Số lượng" },
  { field: "totalPrice", headerName: "Tổng tiền" },
  { field: "staffName", headerName: "Nhân viên lập" },
];

const ServicePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dịch vụ");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null); 

  const tabs = ["Dịch vụ", "Đặt lịch"];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "Dịch vụ") {
        const response = await fetch("http://localhost:8081/service");
        const data = await response.json();
        setServices(data);
      } else {
        const response = await fetch("http://localhost:8081/phieuDichVu");
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value.trim().toLowerCase());
  };
  
  const handleDelete = async (): Promise<void> => {
    if (!selectedService) {
      alert('Vui lòng chọn dịch vụ để xóa');
      return;
    }
  console.log("selected", selectedService);
    try {
      const response = await fetch(`http://localhost:8081/service/${selectedService.id}`, {
        method: 'DELETE',
      }); 
      if (response.status==200) {
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== selectedService.id)
        );
        setSelectedService(null);
        setIsDeleteModalOpen(false);
        // alert(result.message || 'Xóa dịch vụ thành công!');
      } else {
        // alert(result.message || 'Không thể xóa dịch vụ');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Đã xảy ra lỗi khi xóa dịch vụ');
    }
  };

  const handleServiceDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async (): Promise<void> => {
    try {
      console.log("Updating row:", selectedRow);
      setIsModalUpdateOpen(false);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setIsModalUpdateOpen(true);
  };

  const formatBookingData = (bookings: ServiceBooking[]) => {
    return bookings.map(booking => ({
      ...booking,
      createdAt: new Date(booking.createdAt).toLocaleDateString("vi-VN"),
      deliveryDate: new Date(booking.deliveryDate).toLocaleDateString("vi-VN"),
      totalPrice: `${booking.totalPrice.toLocaleString("vi-VN")} VND`,
      staffName: booking.staffLapHoaDon?.name || "Chưa phân công"
    }));
  };

  return (
    <div className="service-page">
      <Header title="Quản lý dịch vụ" />
      <div style={{ padding: "10px" }}></div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 3,
          marginLeft: "20px",
        }}
      >
        <BtnComponent
          btnColorType="primary"
          btnText={`Thêm ${activeTab.toLowerCase()}`}
          onClick={() => setIsModalOpen(true)}
        />
        <DynamicAddForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formType={activeTab}
          updateServices={(newService: Service) =>
            setServices((prev) => [...prev, newService])
          }
        />
        <Box sx={{ marginRight: "300px" }}>
          <TabBar
            tabs={tabs}
            onTabChange={setActiveTab}
            defaultTab="Dịch vụ"
            styleType="custom"
          />
        </Box>
        <SearchComponent
          placeholder={`Tìm kiếm ${activeTab.toLowerCase()}...`}
          keyword={searchKeyword}
          onSearch={handleSearch}
        />
      </Box>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div style={{ padding: "20px" }}>
          {activeTab === "Dịch vụ" ? (
            <div className="services-grid">
              {services
                .filter((service) =>
                  service.serviceName
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
                .map((service) => (
                  <ServiceComponent
                    key={service.id}
                    serviceName={service.serviceName}
                    serviceCode={service.id}
                    description={service.serviceDescription}
                    price={service.price?.toString() || "0"}
                    imageUrl={service.serviceUrl || undefined}
                    onEdit={() => handleEdit(service)}
                    onDelete={() => handleServiceDelete(service)} 
                  />
                ))}
            </div>
          ) : (
            <TableComponent
              columns={bookingColumns}
              data={formatBookingData(
                bookings.filter((booking) =>
                  booking.nameService
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
              )}
              onRowClick={(row) => console.log("Row clicked:", row)}
              onEdit={handleEdit}
              onDelete={(row) => {
                setSelectedRow(row);
                setIsDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      )}

      <DynamicUpdateForm
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        formType={activeTab}
        handleUpdate={handleUpdate}
        currentData={selectedRow}
      />
      <DeleteComponent
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        deleteName={activeTab}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ServicePage;