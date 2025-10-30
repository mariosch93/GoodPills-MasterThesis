import { createSlice } from '@reduxjs/toolkit'

const savedCart = JSON.parse(localStorage.getItem('cartItems')) || []

const initialState = {
  items: savedCart,
  statusTab: false
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload
      const existing = state.items.find(
        item => item.product.productId === product.productId
      )
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    changeQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(i => i.product.productId === productId)
      if (item) item.quantity = quantity
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(
        item => item.product.productId !== productId
      )
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    toggleStatusTab: state => {
      state.statusTab = !state.statusTab
    },

    clearCart: state => {
      state.items = []
      localStorage.removeItem('cartItems')
    }
  }
})

export const {
  addToCart,
  changeQuantity,
  removeFromCart,
  toggleStatusTab,
  clearCart
} = cartSlice.actions
export default cartSlice.reducer
