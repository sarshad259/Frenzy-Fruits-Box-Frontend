export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "Fresh_fruits", label: "Fresh fruits" },
      { id: "Salad", label: "Salad" },
      { id: "Dry_fruits", label: "Dry fruits" },
      { id: "Milkshake", label: "Milkshake" },
      { id: "Smoothie", label: "Smoothie" },
      { id: "Deal", label: "Deal"}
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "Frenzy Fruits", label: "Frenzy Fruits" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const sizePriceFormElements = [
  {
    label: "Small Price (8oz)",
    name: "smallPrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter small size price",
  },
  {
    label: "Medium Price (12oz)",
    name: "mediumPrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter medium size price",
  },
  {
    label: "Large Price (16oz)",
    name: "largePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter large size price",
  },
  {
    label: "Small Sale Price (8oz)",
    name: "smallSalePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter small sale price (optional)",
  },
  {
    label: "Medium Sale Price (12oz)",
    name: "mediumSalePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter medium sale price (optional)",
  },
  {
    label: "Large Sale Price (16oz)",
    name: "largeSalePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter large sale price (optional)",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "Fresh_fruits",
    label: "Fresh fruits",
    path: "/shop/listing",
  },
  {
    id: "Salad",
    label: "Salad",
    path: "/shop/listing",
  },
  {
    id: "Dry_fruits",
    label: "Dry fruits",
    path: "/shop/listing",
  },
  {
    id: "Milkshake",
    label: "Milkshake",
    path: "/shop/listing",
  },
  {
    id: "Smoothie",
    label: "Smoothie",
    path: "/shop/listing",
  },
  {
    id: "Deal",
    label: "Deal",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  Fresh_fruits: "Fresh fruits",
  Salad: "Salad",
  Dry_fruits: "Dry fruits",
  Milkshake: "Milkshake",
  Smoothie: "Smoothie",
  Deal: "Deal",
};

export const brandOptionsMap = {
  "Frenzy Fruits": "Frenzy Fruits",
};

export const filterOptions = {
  category: [
    { id: "Fresh_fruits", label: "Fresh fruits" },
    { id: "Salad", label: "Salad" },
    { id: "Dry_fruits", label: "Dry fruits" },
    { id: "Milkshake", label: "Milkshake" },
    { id: "Smoothie", label: "Smoothie" },
    { id: "Deal", label: "Deal" },
  ],
  brand: [
    { id: "Frenzy Fruits", label: "Frenzy Fruits" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
