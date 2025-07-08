import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 w-full max-w-full sm:max-w-[420px] mb-2 
        border-2 
        ${selectedId?._id === addressInfo?._id
          ? "border-[3px] border-yellow-400 shadow-lg"
          : "border-yellow-300"}
        bg-black rounded-xl
        hover:shadow-xl
      `}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex flex-col sm:flex-row gap-2 justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)} className="w-full sm:w-auto">Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)} className="w-full sm:w-auto">Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
