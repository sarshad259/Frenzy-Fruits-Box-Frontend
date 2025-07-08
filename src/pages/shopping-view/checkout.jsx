import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { clearCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { isLoading: cartLoading } = useSelector((state) => state.shopCart);
  const { isLoading: orderLoading } = useSelector((state) => state.shopOrder);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  const isLoading = cartLoading || orderLoading;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [user?.id, dispatch]);

  const totalCartAmount =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            ((item?.salePrice > 0 ? item.salePrice : item.price) * item.quantity),
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartItems: cartItems.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item.salePrice : item.price,
        quantity: item?.quantity,
        ...(item?.size && { size: item.size }),
        ...(item?.sizeLabel && { sizeLabel: item.sizeLabel }),
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        setIsOrderConfirmed(true);
        dispatch(clearCart());
        
        if (user?.id) {
          axios.delete(`http://localhost:5000/api/shop/cart/clear/${user.id}`)
            .then(res => {})
            .catch(err => {
              console.error('Failed to clear cart:', err);
            });
        }
        // Clear cart from localStorage/sessionStorage as well
        localStorage.removeItem('cart');
        sessionStorage.removeItem('cart');
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  useEffect(() => {
    if (isOrderConfirmed) {
      toast({
        title:
          "Your order has been confirmed and is now being prepared for delivery. Please have the cash payment ready upon arrival. For any inquiries, kindly contact us via WhatsApp.",
        variant: "success",
      });
    }
  }, [isOrderConfirmed, toast]);

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  if (isOrderConfirmed) {
    return <Navigate to="/shop/home" replace />;
  }

  return (
    <div className="relative min-h-[400px]">
      <div className={isLoading ? 'opacity-30 pointer-events-none select-none' : ''}>
        <div className="flex flex-col">
          <div className="relative h-[300px] w-full overflow-hidden">
            <img
              src={img}
              className="h-full w-full object-cover object-center"
              alt="Checkout Banner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
            <div>
              <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold mb-2">Your Cart</h2>

              <div className="space-y-3">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item, idx) => (
                    <div key={item.productId || item._id || item.id}>
                      <UserCartItemsContent cartItem={item} />
                      {item?.sizeLabel && (
                        <div className="text-sm text-muted-foreground mb-1 pl-2">{item.sizeLabel}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">Your cart is empty!</div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-base">PKR {totalCartAmount}</span>
                </div>
              </div>

              <div className="mt-4 w-full">
                <Button
                  onClick={handleInitiatePaypalPayment}
                  disabled={isPaymentStart}
                  className="w-full"
                >
                  {isPaymentStart ? (
                    <span className="flex items-center justify-center gap-2">
                      Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Checkout
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <img
            src={img}
            alt="Account"
            className="w-24 h-24 rounded-full object-cover border-4 border-gold mx-auto mb-4"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
