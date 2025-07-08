import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

// ✅ Fetch cart items from backend
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Cart not found" });
    }
  }
);

// ✅ Add item to cart
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ userId, productId, quantity, salePrice, size, sizeLabel, price }, { getState, rejectWithValue }) => {
    const state = getState();
    let product = state.shopProducts.productList.find(p => p._id === productId);

    // If not found, fetch from backend
    if (!product) {
      try {
        const response = await axios.get(`http://localhost:5000/api/shop/products/get/${productId}`);
        product = response.data?.data;
      } catch (err) {
        return rejectWithValue({ message: "Product not found." });
      }
    }

    if (!product || quantity > product.totalStock) {
      return rejectWithValue({ message: `Only ${product?.totalStock ?? 0} in stock.` });
    }

    try {
      const payload = { userId, productId, quantity };
      if (salePrice !== undefined) payload.salePrice = salePrice;
      if (size !== undefined) payload.size = size;
      if (sizeLabel !== undefined) payload.sizeLabel = sizeLabel;
      if (price !== undefined) payload.price = price;

      const response = await axios.post("http://localhost:5000/api/shop/cart/add", payload);
      return response.data;
    } catch (err) {
      console.error('addCartItem error:', err, err.response?.data);
      return rejectWithValue({ message: err.response?.data?.message || "Add to cart failed" });
    }
  }
);

// ✅ Update quantity of a cart item
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, quantity, size }, { getState, rejectWithValue }) => {
    const state = getState();
    const product = state.shopProducts.productList.find(p => p._id === productId);

    if (!product) return rejectWithValue({ message: "Product not found" });

    if (quantity > product.totalStock) {
      return rejectWithValue({ message: `Only ${product.totalStock} items left in stock.` });
    }

    try {
      const payload = { userId, productId, quantity };
      if (size !== undefined) payload.size = size;
      
      const response = await axios.put("http://localhost:5000/api/shop/cart/update-cart", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Quantity update failed" });
    }
  }
);

// ✅ Delete a cart item from backend
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, size }, { rejectWithValue }) => {
    try {
      let url = `http://localhost:5000/api/shop/cart/delete/${userId}/${productId}`;
      if (size) url += `?size=${encodeURIComponent(size)}`;
      const response = await axios.delete(url);
      return { productId, size, cartItems: response.data.data };
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Failed to delete item" });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        // Robust: handle both {data: [...]} and {data: {items: [...]}}
        if (Array.isArray(action.payload.data)) {
          state.cartItems = action.payload.data;
        } else if (action.payload.data && Array.isArray(action.payload.data.items)) {
          state.cartItems = action.payload.data.items;
        } else {
          state.cartItems = [];
        }
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load cart.";
      })

      // Add
      .addCase(addCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const newItem = action.payload.data;
        const index = state.cartItems.findIndex(item => item.productId === newItem.productId && (item.size || null) === (newItem.size || null));
        if (index !== -1) {
          state.cartItems[index].quantity = newItem.quantity;
        } else {
          state.cartItems.push(newItem);
        }
        toast({ title: "Product added to cart" });
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Add to cart failed.";
        toast({ title: state.error, variant: "destructive" });
      })

      // Update Quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data;
        const index = state.cartItems.findIndex(item => item.productId === updated.productId && (item.size || null) === (updated.size || null));
        if (index !== -1) {
          state.cartItems[index].quantity = updated.quantity;
        }
        toast({ title: "Cart quantity updated" });
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Quantity update failed.";
        toast({ title: state.error, variant: "destructive" });
      })

      // Delete
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const { productId, size } = action.payload;
        state.cartItems = state.cartItems.filter(item => {
          if (size) {
            return !(item.productId === productId && item.size === size);
          }
          return !(item.productId === productId && !item.size);
        });
        toast({ title: "Item removed from cart" });
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Delete failed.";
        toast({ title: state.error, variant: "destructive" });
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// ✅ All thunks already exported individually above; no duplicates needed.
