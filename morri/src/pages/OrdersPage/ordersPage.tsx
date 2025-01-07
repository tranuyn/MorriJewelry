import React, { useState, useEffect } from "react";
import Header from "../../component/Title_header/Header";
import TabBar from "../../component/Tabbar/TabBar";
import "./ordersPage.css";
import "../../styles/styles.css";
import {
  getAllBillBans,
  BillBanResponse,
  updateBillBan,
  getBillBanById,
  BillBan,
  OrderDetail,
} from "../../services/BillBanService";

import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import styled from "@emotion/styled";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";

interface Column {
  id: "code" | "customer" | "order" | "totalPrice" | "date" | "options";
  label: string;
}

interface Data {
  code: string;
  customer: string;
  order: number;
  date: string;
  options: number;
}

const columns: Column[] = [
  { id: "code", label: "Mã đơn hàng" },
  { id: "customer", label: "Khách hàng" },
  { id: "order", label: "Số lượng sản phẩm" },
  { id: "totalPrice", label: "Tổng giá" },
  { id: "date", label: "Ngày đặt" },
  { id: "options", label: "Tùy chọn" },
];

// Thêm biến columns động dựa theo activeTab
const getColumns = (activeTab: string) => {
  const baseColumns = [
    { id: "code", label: "Mã đơn hàng" },
    { id: "customer", label: "Khách hàng" },
    { id: "order", label: "Số lượng sản phẩm" },
    { id: "totalPrice", label: "Tổng giá" },
    { id: "date", label: "Ngày đặt" },
  ];

  // Chỉ thêm cột options nếu là tab Đơn đang đặt
  if (activeTab === "Đơn đang đặt") {
    baseColumns.push({ id: "options", label: "Tùy chọn" });
  }

  return baseColumns;
};

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Đơn đang đặt");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [rows, setRows] = useState<BillBanResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingOrderDetails, setEditingOrderDetails] = useState<OrderDetail[]>(
    []
  );
  const [editingOrderCode, setEditingOrderCode] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Gọi API để lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBillBans();
        console.log("data" + data); // Gọi API từ service
        setRows(data); // Cập nhật dữ liệu vào state
      } catch (err) {
        setError("Không thể tải dữ liệu đơn hàng!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredRows = rows.filter((row) => {
    if (activeTab === "Đơn đang đặt") {
      return row.status === "ON_DELIVERY";
    } else {
      return row.status === "COMPLETED";
    }
  });

  const handleRowClick = (code: string) => {
    setExpandedRow(expandedRow === code ? null : code);
  };

  const handleEdit = (row: BillBanResponse, event: React.MouseEvent) => {
    event.stopPropagation();

    // Nếu đang edit thì tắt edit
    if (editingOrderCode === row.code) {
      setEditingOrderCode(null);
      setEditingOrderDetails([]);
      return;
    }

    // Nếu chưa edit thì bật edit
    setEditingOrderCode(row.code);
    setEditingOrderDetails(row.orderDetails);
    setExpandedRow(row.code);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setEditingOrderDetails((prev) => {
      const updated = prev.map((detail) => {
        if (detail.product.id === productId) {
          const newSubtotal = detail.unitPrice * newQuantity;
          return {
            ...detail,
            quantity: newQuantity,
            subtotal: newSubtotal,
          };
        }
        return detail;
      });

      // Cập nhật lại rows để hiển thị totalPrice mới
      setRows((currentRows) => {
        return currentRows.map((row) => {
          if (row.code === expandedRow) {
            return {
              ...row,
              totalPrice: calculateNewTotal(updated),
              orderDetails: updated,
            };
          }
          return row;
        });
      });

      return updated;
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setEditingOrderDetails((prev) => {
      if (prev.length <= 1) return prev;

      const updated = prev.filter((detail) => detail.product.id !== productId);

      // Cập nhật lại rows để hiển thị totalPrice mới
      setRows((currentRows) => {
        return currentRows.map((row) => {
          if (row.code === expandedRow) {
            return {
              ...row,
              totalPrice: calculateNewTotal(updated),
              orderDetails: updated,
            };
          }
          return row;
        });
      });

      return updated;
    });
  };

  const calculateNewTotal = (orderDetails: OrderDetail[]) => {
    return orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
  };

  const handleSaveChanges = async (billId: string) => {
    setIsUpdating(true);
    try {
      const billDetails = await getBillBanById(billId);
      console.log("Original bill:", billDetails);

      const updatedBill: BillBan = {
        ...billDetails,
        orderDetails: editingOrderDetails.map((detail) => ({
          ...detail,
          subtotal: detail.quantity * detail.unitPrice,
        })),
        totalPrice: calculateNewTotal(editingOrderDetails),
      };
      console.log("Updated bill being sent:", updatedBill);
      await updateBillBan(billId, updatedBill);

      // Refresh data
      const updatedData = await getAllBillBans();
      alert("Cập nhật đơn hàng thành công!");
      setEditingOrderCode(null);
      setRows(updatedData);
      setEditingOrderDetails([]);
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      alert("Có lỗi xảy ra khi cập nhật đơn hàng!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {};

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số dòng
  };

  const startRow = page * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const displayedRows = filteredRows.slice(startRow, endRow);

  const tabs = ["Đơn đang đặt", "Đơn đã hoàn thành"];
  const StyledIconButton = styled(IconButton)`
    margin: 4px 0px;
  `;

  return (
    <div className="orderPage">
      <Header title="Đơn hàng" />
      <div className="customTabbarPosition">
        <TabBar
          tabs={tabs}
          onTabChange={setActiveTab}
          styleType="custom"
          defaultTab="Đơn đang đặt"
        />
      </div>
      <div className="page-content">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <table className="tableCotainer" style={{ width: "100%" }}>
              <thead className="theadContainer">
                <tr>
                  {getColumns(activeTab).map((column) => (
                    <th
                      key={column.id}
                      style={{ padding: "5px", textAlign: "center" }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedRows.map((row) => (
                  <React.Fragment key={row.code}>
                    <tr
                      onClick={() => handleRowClick(row.code)}
                      style={{ cursor: "pointer" }}
                    >
                      {getColumns(activeTab).map((column) => (
                        <td
                          key={column.id}
                          className={column.id === "options" ? "options" : ""}
                        >
                          {column.id === "totalPrice" ? (
                            <span>
                              {row.totalPrice.toLocaleString("vi-VN")} đ
                            </span>
                          ) : column.id === "options" ? ( // Kiểm tra cột "options"
                            <>
                              <StyledIconButton
                                className={`edit-button ${
                                  editingOrderCode === row.code ? "active" : ""
                                }`}
                                size="small"
                                onClick={(event) => handleEdit(row, event)}
                              >
                                <BorderColorIcon fontSize="small" />
                              </StyledIconButton>
                              <StyledIconButton
                                className="delete-button"
                                size="small"
                                onClick={(event) => handleDelete()}
                              >
                                <DeleteIcon fontSize="small" />
                              </StyledIconButton>
                            </>
                          ) : (
                            row[column.id as keyof Data]
                          )}
                        </td>
                      ))}
                    </tr>
                    {expandedRow === row.code && (
                      <tr>
                        <td colSpan={columns.length}>
                          <div className="order-details">
                            <table className="inner-table">
                              <thead>
                                <tr>
                                  <th>Hình ảnh</th>
                                  <th>Mã sản phẩm</th>
                                  <th>Tên sản phẩm</th>
                                  <th>Số lượng</th>
                                  <th>Đơn giá</th>
                                  <th>Thành tiền</th>
                                  {editingOrderCode === row.code && (
                                    <th>Thao tác</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {(editingOrderCode === row.code
                                  ? editingOrderDetails
                                  : row.orderDetails
                                ).map((detail) => (
                                  <tr key={detail.product.id}>
                                    <td>
                                      <img
                                        src={detail.product.imageUrl[0]}
                                        alt={detail.product.name}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </td>
                                    <td>{detail.product.code}</td>
                                    <td>{detail.product.name}</td>
                                    <td>
                                      {editingOrderCode === row.code ? (
                                        <div className="quantity-controls">
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleQuantityChange(
                                                detail.product.id,
                                                detail.quantity - 1
                                              )
                                            }
                                            disabled={detail.quantity <= 1}
                                          >
                                            <RemoveOutlinedIcon />
                                          </IconButton>
                                          <span>{detail.quantity}</span>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleQuantityChange(
                                                detail.product.id,
                                                detail.quantity + 1
                                              )
                                            }
                                          >
                                            <AddOutlinedIcon />
                                          </IconButton>
                                        </div>
                                      ) : (
                                        detail.quantity
                                      )}
                                    </td>
                                    <td>
                                      {detail.unitPrice.toLocaleString("vi-VN")}{" "}
                                      đ
                                    </td>
                                    <td>
                                      {detail.subtotal.toLocaleString("vi-VN")}{" "}
                                      đ
                                    </td>
                                    {editingOrderCode === row.code && (
                                      <td>
                                        <IconButton
                                          className="delete-button"
                                          size="small"
                                          onClick={() =>
                                            handleDeleteProduct(
                                              detail.product.id
                                            )
                                          }
                                          disabled={
                                            editingOrderDetails.length <= 1
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td
                                    colSpan={5}
                                    style={{ textAlign: "right" }}
                                  >
                                    <strong>Tổng cộng:</strong>
                                  </td>
                                  <td>
                                    <strong
                                      style={{
                                        color: "#FF0000",
                                      }}
                                    >
                                      {(editingOrderCode === row.code
                                        ? calculateNewTotal(editingOrderDetails)
                                        : row.totalPrice
                                      ).toLocaleString("vi-VN")}{" "}
                                      đ
                                    </strong>
                                  </td>
                                  {editingOrderCode === row.code && <td></td>}
                                </tr>
                              </tfoot>
                            </table>
                            {editingOrderCode === row.code && (
                              <div
                                className="edit-actions"
                                style={{
                                  marginTop: "1rem",
                                  textAlign: "right",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setEditingOrderCode(null);
                                    setEditingOrderDetails(row.orderDetails);
                                  }}
                                  style={{ marginRight: "1rem" }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSaveChanges(row.code)}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                <KeyboardArrowLeftRoundedIcon />
              </button>
              <span>{` Page ${page + 1} of ${Math.ceil(
                filteredRows.length / rowsPerPage
              )} `}</span>
              <button
                className="ArrowButton"
                onClick={() => handleChangePage(page + 1)}
                disabled={endRow >= filteredRows.length}
              >
                <KeyboardArrowRightRoundedIcon />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
