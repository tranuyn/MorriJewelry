import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import Header from "../ProductsAndServices/header";
import TabBar from "../../component/Tabbar/TabBar";

interface ProductType {
  id: string;
  name: string;
  code: string;
  material: string;
  sellingPrice: number;
  costPrice: number;
  imageUrl: string[];
  quantity: number;
  weight: number;
  loaiSanPham: string;
  description: string;
  status: string;
  chiPhiPhatSinh: number;
  supplerId: object;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const tabs = [
    "Tất cả",
    "Đá quý",
    "Vòng cổ",
    "Nhẫn",
    "Hoa tai",
    "Vòng tay",
    "Dịch vụ",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Đá quý":
        return <div className="pbcontainer"></div>;
      case "Vòng cổ":
        return <div className="pbcontainer"></div>;
      case "Nhẫn":
        return <div className="pbcontainer"></div>;
      case "Hoa tai":
        return <div className="pbcontainer"></div>;
      case "Vòng tay":
        return <div className="pbcontainer"></div>;
      case "Dịch vụ":
        return <div className="pbcontainer"></div>;
      default:
        return <div></div>;
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8081/jewelry/${id}`);
          const data = await response.json();
          setProduct(data); // Giả sử data là thông tin sản phẩm
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  function formatPrice(price: number): string {
    if (isNaN(price)) {
      return "0";
    }

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleImageClick = (index: number) => {
    setSelectedImgIndex(index); // Update selected image index
  };

  const decreaseQuantityClick = (count: number) => {
    if (count === 1) {
      return;
    }
    setQuantityToBuy(count - 1);
  };

  const increaseQuantityClick = (count: number) => {
    if (count === product?.quantity) {
      return;
    }
    setQuantityToBuy(count + 1);
  };

  const navigate = useNavigate();
  const handleBuyNow = () => {
    if (!product?.id) {
      return;
    }
    const selectedProducts = [product];
    const quantities = { [product?.id]: quantityToBuy };
    navigate("/products/checkout", {
      state: {
        selectedProducts,
        quantities,
      },
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="productDetailContainer">
      <Header />
      <TabBar tabs={tabs} onTabChange={setActiveTab} styleType="default" />

      <div className="detailContainerne">
        <div className="part1">
          <div className="imgsContainerne">
            {product.imageUrl.map((imageUrl, index) => (
              <img
                className={`imgSmall ${
                  selectedImgIndex === index ? "selected" : ""
                }`}
                onClick={() => handleImageClick(index)}
                key={index}
                src={imageUrl}
                alt={`Product image ${index}`}
              />
            ))}
          </div>
          <img
            src={product.imageUrl[selectedImgIndex]}
            className="imgBig"
            alt="Main product image"
          />
        </div>
        <div className="part2">
          <div className="namene">{product.name}</div>
          <div className="codene">Mã: {product.code}</div>
          <div className="pricene">đ {formatPrice(product.sellingPrice)}</div>
          <div className="codene">
            (Giá sản phẩm thay đổi tùy trọng lượng vàng và đá)
          </div>
          <div className="part1">
            <div className="billItemQuantityDetail" style={{ width: "200px" }}>
              <div
                className="buttonSubCheckout"
                style={{ paddingTop: "5px" }}
                onClick={() => decreaseQuantityClick(quantityToBuy)}
              >
                -
              </div>
              <div className="buttonNoneCheckout" style={{ paddingTop: "5px" }}>
                {quantityToBuy}
              </div>
              <div
                className="buttonSubCheckout"
                style={{ paddingTop: "5px" }}
                onClick={() => increaseQuantityClick(quantityToBuy)}
              >
                +
              </div>
            </div>
            <div
              className="pricene"
              style={{ fontSize: "20px", flex: 1, textAlign: "right" }}
            >
              đ {formatPrice(product.sellingPrice * quantityToBuy)}
            </div>
          </div>
          <div className="quantityne">Số lượng kho: {product.quantity}</div>
          <div className="prne">
            Morri có thu mua trang sức cũ và phục vụ dịch vụ đa đạng, mời bạn
            ghé cửa hàng xem chi tiết sản phẩm nhé.
          </div>
          <button className="BuyNowNe" onClick={() => handleBuyNow()}>
            Mua ngay
          </button>
          <button className="EditNe">Chỉnh sửa thông tin</button>
        </div>
      </div>

      <div className="detailContainerne">
        <div className="part3">
          <div className="namene">Mô tả sản phẩm</div>
          <div className="bluebgne">Thương hiệu: Morri Jewelry</div>
          <div className="yellowbgne">Tên sản phẩm: {product.name}</div>
          <div className="bluebgne">Mã sản phẩm: {product.code}</div>
          <div className="yellowbgne">Loại sản phẩm: {product.loaiSanPham}</div>
          <div className="bluebgne">
            Giá bán: {formatPrice(product.sellingPrice)} VND
          </div>
          <div className="yellowbgne">Chất liệu: {product.material}</div>
          <div className="bluebgne">Khối lượng tham khảo: {product.weight}</div>
          <div className="yellowbgne">Số lượng còn lại: {product.quantity}</div>
          <div className="bluebgne">Tình trạng: {product.status}</div>
          <div className="yellowbgne">
            Chi phí phát sinh: {formatPrice(product.chiPhiPhatSinh)} VND
          </div>
          <div className="bluebgne">
            Giá nhập: {formatPrice(product.costPrice)} VND
          </div>
        </div>
        <div className="part4">
          <button className="viewSupplierBtn">Xem nhà cung cấp</button>
          <div>{product.description}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
