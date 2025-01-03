import React, { useState } from "react";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

export interface Column {
  id:
    | "id"
    | "date"
    | "supplier"
    | "actors"
    | "listProduct"
    | "totalPrice"
    | "note"
    | "options";
  label: string;
}

const columns: Column[] = [
  { id: "id", label: "Mã phiếu" },
  { id: "date", label: "Ngày tạo phiếu" },
  { id: "supplier", label: "Nhà cung cấp" },
  { id: "actors", label: "Tác nhân" },
  { id: "listProduct", label: "Danh sách sản phẩm" },
  { id: "totalPrice", label: "Tổng giá trị" },
  { id: "note", label: "Ghi chú" },
  { id: "options", label: "Options" },
];

interface Data {
  id: string;
  date: string;
  supplier: string;
  actors: string;
  listProduct: string;
  totalPrice: number;
  note: string;
  options: string;
}

const createData = (
  id: string,
  date: string,
  supplier: string,
  actors: string,
  listProduct: string,
  totalPrice: number,
  note: string,
  options: string
): Data => {
  return { id, date, supplier, actors, listProduct, totalPrice, note, options };
};

// Tạo dữ liệu mẫu
const rows: Data[] = [
  createData(
    "PNK001203",
    new Date().toLocaleDateString(),
    "Cocoon",
    "Trinh Tran Phuong Tuan",
    "PNJ Jasmine ZTMXY000005",
    799.999,
    "Ngọc đẹp",
    "Edit / Delete"
  ),
  createData(
    "PNK001203",
    new Date().toLocaleDateString(),
    "Cocoon",
    "Trinh Tran Phuong Tuan",
    "Nhẫn Vàng 14K Disney|PNJ Jasmine 0000Y003145",
    777.55,
    "Nhẫn cặp đôi",
    "Edit / Delete"
  ),
];

const HistoryEI: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

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
  const displayedRows = rows.slice(startRow, endRow);

  return (
    <div className="page-content">
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
                <td key={column.id}>{row[column.id]}</td>
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
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
        >
          <KeyboardArrowLeftRoundedIcon />
        </button>
        <span>{` Page ${page + 1} of ${Math.ceil(
          rows.length / rowsPerPage
        )} `}</span>
        <button
          className="ArrowButton"
          onClick={() => handleChangePage(page + 1)}
          disabled={endRow >= rows.length}
        >
          <KeyboardArrowRightRoundedIcon />
        </button>
      </div>
    </div>
  );
};

export default HistoryEI;
