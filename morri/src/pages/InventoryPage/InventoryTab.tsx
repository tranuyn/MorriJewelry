import React, { useState } from "react";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Modal, Box, TextField, Button } from "@mui/material";
import styled from "@emotion/styled";
import { Product } from "./Inventory";
import "./Inventory.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditProductModal from "../../component/EditProductModal";
import ProductForm from "./productForm";
const theme = createTheme({
  typography: {
    fontFamily: "Baloo 2, sans-serif",
  },
});

interface InventoryTabProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface Column {
  id: keyof (Product & { options: string });
  label: string;
}

const columns: Column[] = [
  { id: "code", label: "Mã sản phẩm" },
  { id: "name", label: "Tên sản phẩm" },
  { id: "quantity", label: "Số lượng" },
  { id: "material", label: "Chất liệu" },
  { id: "description", label: "Mô tả" },
  { id: "sellingPrice", label: "Giá bán" },
  { id: "status", label: "Trạng thái" },
  { id: "options", label: "Tùy chọn" },
];

const StyledIconButton = styled(IconButton)`
  margin: 4px 0px;
`;

const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  loading,
  error,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startRow = page * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const displayedRows = filteredProducts
    .map((product) => ({
      ...product,
      options: "...",
    }))
    .slice(startRow, endRow);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onPageChange(0);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    setUpdateError(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setUpdateError(null);
  };

  const handleFieldChange = (field: keyof Product, value: string | number) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [field]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(
        `http://localhost:8081/jewelry/update/${editingProduct.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const refreshResponse = await fetch("http://localhost:8081/jewelry/");
      const newProducts = await refreshResponse.json();
      setProducts(newProducts);

      handleCloseModal();
    } catch (error) {
      console.error("Error updating product:", error);
      setUpdateError("Không thể cập nhật sản phẩm. Vui lòng thử lại!");
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch("http://localhost:8081/jewelry/"); // Replace with your API URL
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleDelete = async (product: Product) => {
    const confirmDelete = window.confirm(
      "Bạn có thật sự muốn ngừng kinh doanh sản phẩm này không?"
    );

    if (!confirmDelete) {
      return; // Nếu người dùng không xác nhận, dừng hành động
    }

    try {
      const updatedProduct = {
        ...product,
        status: "unavailable",
      };

      const response = await fetch(
        `http://localhost:8081/jewelry/update/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      // Refresh the products list
      const refreshResponse = await fetch("http://localhost:8081/jewelry/");
      const newProducts = await refreshResponse.json();
      setProducts(newProducts);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ThemeProvider theme={theme}>
      <div className="page-content">
        <div className="psearchbar" style={{ marginBottom: 10 }}>
          <SearchIcon sx={{ color: "#737373" }} />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <table className="tableCotainer" style={{ width: "100%" }}>
          <thead className="theadContainer">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{ padding: "8px", textAlign: "center" }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.id} style={{ textAlign: "center" }}>
                    {column.id === "sellingPrice" ? (
                      formatPrice(row[column.id] as number)
                    ) : column.id === "description" ? (
                      <div style={{ maxWidth: "800px" }}>{row[column.id]}</div>
                    ) : column.id === "status" ? (
                      row[column.id] === "available" ? (
                        "Đang kinh doanh"
                      ) : (
                        "Ngừng kinh doanh"
                      )
                    ) : column.id === "options" ? (
                      <>
                        <StyledIconButton
                          className="edit-button"
                          size="small"
                          // onClick={() => handleEditClick(row)}
                          onClick={() => {
                            setEditingProduct(row);
                            setIsOpen(true);
                          }}
                        >
                          <BorderColorIcon fontSize="small" />
                        </StyledIconButton>
                        <StyledIconButton
                          className="delete-button"
                          size="small"
                          onClick={() => handleDelete(row)}
                        >
                          <DeleteIcon fontSize="small" />
                        </StyledIconButton>
                      </>
                    ) : column.id === "images" ? null : ( // Skip rendering images array
                      row[column.id]?.toString() || ""
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <EditProductModal
          open={isEditModalOpen}
          product={editingProduct}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onFieldChange={handleFieldChange}
          updateError={updateError}
        />

        <div className="numberOfPageContainer">
          <select onChange={onRowsPerPageChange} value={rowsPerPage}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <button
            className="ArrowButton"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            <KeyboardArrowLeftRoundedIcon />
          </button>
          <span>{` Page ${page + 1} of ${Math.ceil(
            filteredProducts.length / rowsPerPage
          )} `}</span>
          <button
            className="ArrowButton"
            onClick={() => onPageChange(page + 1)}
            disabled={endRow >= filteredProducts.length}
          >
            <KeyboardArrowRightRoundedIcon />
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="myModal" className="modalEditProduct">
          <div className="modalEditProduct-content">
            <div className="hii">
              <div className="namene">Cập nhật thông tin sản phẩm</div>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
            </div>
            <ProductForm
              data={editingProduct}
              setData={() => {
                closeModal();
                fetchProduct();
              }}
            />
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default InventoryTab;
