import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    const updatePayload = {
      userId: user?.id,
      productId: getCartItem?.productId,
      quantity:
        typeOfAction === "plus"
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1,
      size: getCartItem?.size,
    };
    
    
    dispatch(
      updateCartItemQuantity(updatePayload)
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    const payload = { userId: user?.id, productId: getCartItem?.productId };
    if (typeof getCartItem?.size === 'string' && getCartItem.size.length > 0) payload.size = getCartItem.size;
    
    dispatch(deleteCartItem(payload)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  // Helper to get price and label
  function getDisplayPrice() {
    // Prefer cart item price/salePrice
    if (cartItem?.salePrice > 0) return cartItem.salePrice;
    if (cartItem?.price > 0) return cartItem.price;
    // Fallback: try to get from productList (if available)
    const product = productList.find(p => p._id === cartItem.productId);
    if (product) {
      if (cartItem.size === "small") return product.smallSalePrice > 0 ? product.smallSalePrice : product.smallPrice;
      if (cartItem.size === "medium") return product.mediumSalePrice > 0 ? product.mediumSalePrice : product.mediumPrice;
      if (cartItem.size === "large") return product.largeSalePrice > 0 ? product.largeSalePrice : product.largePrice;
      return product.salePrice > 0 ? product.salePrice : product.price;
    }
    return 0;
  }
  function getDisplaySizeLabel() {
    if (cartItem?.sizeLabel) return cartItem.sizeLabel;
    if (cartItem?.size === "small") return "Small (8oz)";
    if (cartItem?.size === "medium") return "Medium (12oz)";
    if (cartItem?.size === "large") return "Large (16oz)";
    return null;
  }
  const displayPrice = getDisplayPrice();
  const displaySizeLabel = getDisplaySizeLabel();

  return (
    <div className="flex items-center space-x-4 bg-secondary rounded-xl shadow-md p-3 mb-2 animate-fade-in-up transition-shadow duration-200">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded-lg object-cover border-2 border-border"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="font-extrabold text-primary">{cartItem?.title}</h3>
        {displaySizeLabel && (
          <div className="text-sm text-muted-foreground mb-1">{displaySizeLabel}</div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full border-primary text-primary"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold text-lg">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full border-primary text-primary"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-bold text-lg">
          PKR {(displayPrice * cartItem?.quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash
            className="cursor-pointer"
            size={20}
          />
          <span className="sr-only">Delete item</span>
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;