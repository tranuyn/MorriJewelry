import React, { useState, useEffect } from "react";
import Header from "./header";
import TabBar from "../../component/Tabbar/TabBar";
import Charms from "./Charms";
// import VongCo from "./VongCo";
// import Nhan from "./Nhan";
// import HoaTai from "./HoaTai";
// import VongTay from "./VongTay";
import Services from "./Services";
import "./style.css";
import SearchAndFilter from "./SearchAndFilter/searchAndFilter";
import Product from "./ProductAndBill/Product";
import Bill from "./ProductAndBill/Bill";

interface ProductType {
  id: string;
  name: string;
  material: string;
  sellingPrice: number;
  imageUrl: string[];
  quantityInBill: number;
  loaiSanPham: string;
}
const ProductsAndService: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);

  const handleSelectProduct = (product: ProductType) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      // If the product already exists, increase its quantity
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, quantityInBill: p.quantityInBill + 1 }
            : p
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantityInBill: 1 },
      ]);
    }
  };

  const tabs = [
    "Tất cả",
    "Đá quý",
    "Vòng cổ",
    "Nhẫn",
    "Hoa tai",
    "Vòng tay",
    "Dịch vụ",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8081/jewelry/"); // Replace with your API URL
        const data = await response.json();
        setProducts(data); // Assume data is an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Đá quý":
        const charmsProducts = products.filter((product) =>
          ["DAQUY", "KIMCUONG", "THACH", "NGOC"].includes(product.loaiSanPham)
        );
        return (
          <div className="pbcontainer">
            <div className="product-container">
              <Product
                products={charmsProducts}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="bill-container">
              <Bill selectedProducts={selectedProducts} />
            </div>
          </div>
        );
      case "Vòng cổ":
        const VongCoProducts = products.filter(
          (product) => product.loaiSanPham === "DAYCHUYEN" // So sánh trực tiếp giá trị chuỗi
        );
        return (
          <div className="pbcontainer">
            <div className="product-container">
              <Product
                products={VongCoProducts}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="bill-container">
              <Bill selectedProducts={selectedProducts} />
            </div>
          </div>
        );
      case "Nhẫn":
        const nhanProducts = products.filter(
          (product) => product.loaiSanPham === "NHAN" // So sánh trực tiếp giá trị chuỗi
        );
        return (
          <div className="pbcontainer">
            <div className="product-container">
              <Product
                products={nhanProducts}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="bill-container">
              <Bill selectedProducts={selectedProducts} />
            </div>
          </div>
        );
      case "Hoa tai":
        const bongTaiProducts = products.filter(
          (product) => product.loaiSanPham === "BONGTAI" // So sánh trực tiếp giá trị chuỗi
        );
        return (
          <div className="pbcontainer">
            <div className="product-container">
              <Product
                products={bongTaiProducts}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="bill-container">
              <Bill selectedProducts={selectedProducts} />
            </div>
          </div>
        );
      case "Vòng tay":
        const vongTayProducts = products.filter(
          (product) => product.loaiSanPham === "VONGTAY" // So sánh trực tiếp giá trị chuỗi
        );
        return (
          <div className="pbcontainer">
            <div className="product-container">
              <Product
                products={vongTayProducts}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="bill-container">
              <Bill selectedProducts={selectedProducts} />
            </div>
          </div>
        );
      case "Dịch vụ":
        return <Services />;
      default:
        return (
          <div className="pbcontainer">
            <div className="product-container">
              <Product
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="bill-container">
              <Bill selectedProducts={selectedProducts} />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F9FCFF",
        position: "relative",
        overflow: "visible",
        height: "100vh",
      }}
    >
      <Header />
      <div className="pbanner">
        <div className="pbannerTextContainer">
          <span className="pmorri">
            MORRI<br></br>JEWELRY
          </span>
          <span className="pTitle">
            <br />
            Mỗi một món trang sức đều có câu chuyện riêng. Đeo trang sức là cách
            thể hiện bạn trân trọng kỷ niệm mà không cần một lời nói nào.
          </span>
        </div>
      </div>

      <TabBar
        tabs={tabs}
        onTabChange={setActiveTab}
        styleType="default"
        defaultTab="Tất cả"
      />
      <SearchAndFilter />

      {/* <div className="pbcontainer">
        <div className="product-container">
          <Product products={products} onSelectProduct={handleSelectProduct} />
        </div>

        <div className="bill-container">
          <Bill selectedProducts={selectedProducts} />
        </div>
      </div> */}

      <div className="page-content">
        <div className="content-text">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProductsAndService;
