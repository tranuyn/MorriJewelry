import React, { useEffect, useState, ReactNode } from "react";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import TableComponent from "../../component/TableComponent/TableComponent";
import DeleteComponent from "../../component/DeleteComponent/DeleteComponent";
import { Box, Modal, CircularProgress } from "@mui/material";
import BtnComponent from "../../component/BtnComponent/BtnComponent";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import FeedIcon from "@mui/icons-material/Feed";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../services/useAuth";
export interface Column {
  id:
    | "id"
    | "date"
    | "supplier"
    | "staff"
    | "name"
    | "inventoryProducts"
    | "totalPrice"
    | "note"
    | "options";
  label: string;
}

const columns: Column[] = [
  { id: "id", label: "Mã phiếu" },
  { id: "date", label: "Ngày tạo phiếu" },
  { id: "supplier", label: "Nhà cung cấp" },
  { id: "staff", label: "Người lập phiếu" },
  { id: "name", label: "Mô tả phiếu" },
  { id: "inventoryProducts", label: "Danh sách sản phẩm" },
  { id: "totalPrice", label: "Tổng giá trị" },
  { id: "note", label: "Ghi chú" },
  { id: "options", label: "Options" },
];

interface Data {
  id: string;
  date: string;
  supplier: string;
  staff: string;
  name: string;
  inventoryProducts: ReactNode;
  totalPrice: number;
  note: string;
  options: ReactNode;
}

const createData = (
  id: string,
  date: string,
  supplier: string,
  staff: string,
  name: string,
  inventoryProducts: ReactNode,
  totalPrice: number,
  note: string,
  options: ReactNode
): Data => {
  return {
    id,
    date,
    supplier,
    staff,
    name,
    inventoryProducts,
    totalPrice,
    note,
    options,
  };
};

const HistoryEI: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rows, setRows] = useState<Data[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sortedRows, setSortedRows] = useState<Data[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("default");
  const [originalRows, setOriginalRows] = useState<Data[]>([]); // Lưu trữ data gốc
  const [displayRows, setDisplayRows] = useState<Data[]>([]); // Data đã được sort
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryLength, setInventoryLength] = useState(0);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      // await handleDelete();
      const response = await fetch(
        `http://localhost:8081/inventory/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsModalOpen(false);
      if (!response.ok) {
        alert("Xóa phiếu nhập kho thất bại");
      } else
        setDisplayRows((prevRows) =>
          prevRows.filter((row) => row.id !== deleteId)
        );
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("vi-VN"); // Định dạng ngày theo tiếng Việt

    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }); // Định dạng giờ

    return `${formattedDate}\n${formattedTime}`; // Kết hợp ngày và giờ với xuống dòng
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // navigate("/login");
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/inventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          handleLogout();
        }
        console.log("hehe" + (await response.json()));
        throw new Error("Không thể tải dữ liệu đơn hàng!");
      }

      const data = await response.json();

      // Chuyển đổi dữ liệu API để phù hợp với cấu trúc bảng
      setInventoryLength(data.length);
      const transformedRows = data.map((item: any) => {
        return createData(
          item.id,
          formatDate(item.ngayNhapKho),
          item.supplier?.supplierName || "Không xác định",
          item.user?.name || "Không xác định",
          item?.name || "Không xác định",
          <div>
            {item?.inventoryProducts?.map((product: any) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  marginBottom: "8px",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <img
                  src={product?.product?.imageUrl[0]}
                  alt={product?.product?.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontWeight: "500",
                      wordWrap: "break-word",
                      maxWidth: "200px",
                    }}
                  >
                    {product?.product?.name}
                  </div>
                  <div>SL: {product.enteredQuantity}</div>
                </div>
              </div>
            )) || <div>Không có sản phẩm</div>}
          </div>,
          item?.totalPrice || 0,
          item.note || "",
          <div className="three-icon">
            <FeedIcon
              fontSize="small"
              className="editbtn"
              onClick={() => navigate(`/enter-inventory/${item.id}`)}
            />
            <BorderColorIcon
              fontSize="small"
              className="editbtn"
              onClick={() => navigate(`/enter-inventory/${item.id}`)}
            />
            <DeleteIcon
              fontSize="small"
              className="editbtn"
              onClick={() => {
                setIsModalOpen(true);
                setDeleteId(item.id);
              }}
            />
          </div>
        );
      });

      setOriginalRows(transformedRows);
      sortRows(transformedRows, selectedSort);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const sortRows = (rows: Data[], sortType: string) => {
    let sorted = [...rows];

    switch (sortType) {
      case "newest":
        sorted = sorted.sort((a, b) => {
          let timeA = a.date.split("\n")[1];
          let timeB = b.date.split("\n")[1];
          const dateA = new Date(
            a.date.split("\n")[0].split("/").reverse().join("/")
          );
          const dateB = new Date(
            b.date.split("\n")[0].split("/").reverse().join("/")
          );
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime();
          }
          const [hourA, minuteA] = timeA.split(":").map(Number);
          const [hourB, minuteB] = timeB.split(":").map(Number);

          // So sánh giờ và phút
          if (hourA !== hourB) {
            return hourB - hourA; // Sắp xếp theo giờ
          }
          return minuteB - minuteA;
        });
        break;
      case "oldest":
        sorted = sorted.sort((a, b) => {
          const dateA = new Date(
            a.date.split("\n")[0].split("/").reverse().join("/")
          );
          const dateB = new Date(
            b.date.split("\n")[0].split("/").reverse().join("/")
          );
          let timeA = a.date.split("\n")[1];
          let timeB = b.date.split("\n")[1];
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
          const [hourA, minuteA] = timeA.split(":").map(Number);
          const [hourB, minuteB] = timeB.split(":").map(Number);

          // So sánh giờ và phút
          if (hourA !== hourB) {
            return hourA - hourB; // Sắp xếp theo giờ
          }
          return minuteA - minuteB;
        });
        break;
      default:
        // Trả về thứ tự gốc
        sorted = [...rows];
    }

    setDisplayRows(sorted);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortType = event.target.value;
    setSelectedSort(sortType);
    sortRows(originalRows, sortType);
    setPage(0); // Reset về trang đầu khi sort
  };

  useEffect(() => {
    const fetchDataF = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        await fetchData(); // Wait for the data to be fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchDataF(); // Call the fetch function
  }, []);

  useEffect(() => {
    setSortedRows(rows);
  }, [rows]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startRow = page * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const paginatedRows = displayRows.slice(startRow, endRow);

  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        Đang tải dữ liệu...
      </div>
    );
  }
  return (
    <div className="page-content">
      <select
        className="SapXep1"
        value={selectedSort}
        onChange={handleSortChange}
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="default">Mặc định</option>
      </select>
      <table className="tableCotainer" style={{ width: "100%" }}>
        <thead className="theadContainer">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{
                  padding: "8px",
                  textAlign: "center",
                  maxWidth: column.id === "id" ? "200px" : "auto",
                  wordWrap: "break-word",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "white" }}>
          {paginatedRows.map((row) => (
            <tr key={row.id} className="EIrow">
              {columns.map((column) => (
                <td
                  key={column.id}
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    maxWidth: "100px",
                    wordWrap: "break-word",
                  }}
                >
                  {row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="numberOfPageContainer">
        <select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
        <button
          className="ArrowButton"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          <KeyboardArrowLeftRoundedIcon />
        </button>
        <span>{` Page ${page + 1} of ${Math.ceil(
          inventoryLength / rowsPerPage
        )} `}</span>
        <button
          className="ArrowButton"
          onClick={() => setPage(page + 1)}
          disabled={endRow >= inventoryLength}
        >
          <KeyboardArrowRightRoundedIcon />
        </button>
      </div>

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
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: 400,
            width: "100%",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "16px",
            }}
          >
            Bạn có chắc chắn muốn xoá{" "}
            <span style={{ color: "#d32f2f" }}>{deleteId}</span> không?
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <BtnComponent
              btnColorType="close"
              btnText="Huỷ"
              onClick={() => setIsModalOpen(false)}
            />
            <BtnComponent
              btnColorType="primary"
              btnText={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Xác nhận"
                )
              }
              onClick={handleConfirmDelete}
              disabled={loading}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default HistoryEI;
