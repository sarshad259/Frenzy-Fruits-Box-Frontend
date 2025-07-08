import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="text-lg font-bold text-primary">Order Summary</div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Order Price</p>
            <span className="font-semibold">
              PKR {orderDetails?.totalAmount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed" ||
                  orderDetails?.orderStatus === "delivered"
                    ? "bg-primary text-primary-foreground"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3">
          <div className="font-semibold text-primary">Order Details</div>
          <ul className="grid gap-2">
            {orderDetails?.cartItems?.length > 0 &&
              orderDetails.cartItems.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span>x{item.quantity}</span>
                  <span>PKR {item.price}</span>
                </li>
              ))}
          </ul>
        </div>
        <Separator />
        <div className="grid gap-3">
          <div className="font-semibold text-primary">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground">
            <span>{user.userName}</span>
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}</span>
            <span>{orderDetails?.addressInfo?.phone}</span>
            <span>{orderDetails?.addressInfo?.notes}</span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
