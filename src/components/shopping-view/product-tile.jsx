import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const [selectedSize, setSelectedSize] = useState("medium");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function getSizePrice() {
    if (product?.category === "Milkshake" || product?.category === "Smoothie") {
      const sizeMap = {
        small: {
          price: product?.smallPrice,
          salePrice: product?.smallSalePrice,
          label: "Small (8oz)",
        },
        medium: {
          price: product?.mediumPrice,
          salePrice: product?.mediumSalePrice,
          label: "Medium (12oz)",
        },
        large: {
          price: product?.largePrice,
          salePrice: product?.largeSalePrice,
          label: "Large (16oz)",
        },
      };
      return sizeMap[selectedSize];
    }
    return {
      price: product?.price,
      salePrice: product?.salePrice,
      label: null,
    };
  }
  const sizePrice = getSizePrice();

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg rounded-2xl transition-all duration-300 animate-fade-in-up bg-card">
      <div>
        <div className="relative group overflow-hidden rounded-t-2xl">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-2xl transition-transform duration-500"
            loading="lazy"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground animate-zoom-in">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground animate-zoom-in">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground animate-zoom-in">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 animate-fade-in delay-100 cursor-pointer" onClick={() => handleGetProductDetails(product?._id)}>{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          {(product?.category === "Milkshake" || product?.category === "Smoothie") && (
            <div className="mb-2 w-full">
              <div className="grid grid-cols-3 gap-2">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`w-full py-3 rounded-lg border text-sm font-semibold transition-colors duration-150 text-center shadow-sm
                      ${selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-card text-primary border-border"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                  >
                    {size === "small" && "Small (8oz)"}
                    {size === "medium" && "Medium (12oz)"}
                    {size === "large" && "Large (16oz)"}
                  </button>
                ))}
              </div>
            </div>
          )}
          {(product?.category === "Milkshake" || product?.category === "Smoothie") && (
            <div className="mb-1 text-base font-semibold text-primary">
              {sizePrice?.label}
            </div>
          )}
          <div className="flex justify-between items-center mb-2">
            {product?.category === "Milkshake" || product?.category === "Smoothie" ? (
              <span className="text-lg font-semibold text-primary">
                {sizePrice?.salePrice > 0 ? (
                  <>
                    <span className="line-through mr-2">PKR {sizePrice?.price}</span>
                    <span>PKR {sizePrice?.salePrice}</span>
                  </>
                ) : (
                  <>PKR {sizePrice?.price}</>
                )}
              </span>
            ) : (
              <span
                className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
              >
                PKR {product?.price}
              </span>
            )}
            {product?.category === "Milkshake" || product?.category === "Smoothie" ? null : product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                PKR {product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          {product?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={async (e) => {
                e.stopPropagation();
                let payload;
                if (product?.category === "Milkshake" || product?.category === "Smoothie") {
                  payload = {
                    userId: user?.id,
                    productId: product?._id,
                    quantity: 1,
                    size: selectedSize,
                    sizeLabel: sizePrice.label,
                    price: sizePrice.price,
                    salePrice: sizePrice.salePrice || 0,
                  };
                } else {
                  payload = {
                    userId: user?.id,
                    productId: product?._id,
                    quantity: 1,
                    price: product?.price,
                    salePrice: product?.salePrice || 0,
                  };
                }
                
                try {
                  const result = await dispatch(addCartItem(payload));
                  if (result.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast({
                      title: "Product added to cart successfully",
                    });
                  } else {
                    toast({
                      title: result.payload?.message || "Failed to add product to cart",
                      variant: "destructive",
                    });
                  }
                } catch (err) {
                  toast({ title: 'Dispatch threw error', variant: 'destructive' });
                  console.error('Dispatch threw error:', err);
                }
              }}
              className="w-full transition-transform duration-200 animate-zoom-in"
            >
              Add to cart
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
