"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User, Product, Group, PaymentMethod, Transaction } from "@/lib/api/types"
// import { authService } from "@/features/auth"

interface AppState {
  // Authentication
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Shopping
  cart: Array<Product & { quantity: number }>
  wishlist: Product[]

  // Groups
  userGroups: Group[]

  // Payment
  paymentMethods: PaymentMethod[]
  recentTransactions: Transaction[]

  // UI State
  sidebarOpen: boolean
  theme: "light" | "dark"
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_CART"; payload: Array<Product & { quantity: number }> }
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_WISHLIST"; payload: Product[] }
  | { type: "TOGGLE_WISHLIST"; payload: Product }
  | { type: "SET_USER_GROUPS"; payload: Group[] }
  | { type: "SET_PAYMENT_METHODS"; payload: PaymentMethod[] }
  | { type: "SET_RECENT_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_USER_BALANCE"; payload: number }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_THEME"; payload: "light" | "dark" }

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  cart: [],
  wishlist: [],
  userGroups: [],
  paymentMethods: [],
  recentTransactions: [],
  sidebarOpen: false,
  theme: "light",
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      }

    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload }

    case "SET_CART":
      return { ...state, cart: action.payload }

    case "ADD_TO_CART": {
      const existingItem = state.cart.find((item) => item.id === action.payload.product.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload.product, quantity: action.payload.quantity }],
      }
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) => (item.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item))
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "SET_WISHLIST":
      return { ...state, wishlist: action.payload }

    case "TOGGLE_WISHLIST": {
      const isInWishlist = state.wishlist.some((item) => item.id === action.payload.id)
      return {
        ...state,
        wishlist: isInWishlist
          ? state.wishlist.filter((item) => item.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      }
    }

    case "SET_USER_GROUPS":
      return { ...state, userGroups: action.payload }

    case "SET_PAYMENT_METHODS":
      return { ...state, paymentMethods: action.payload }

    case "SET_RECENT_TRANSACTIONS":
      return { ...state, recentTransactions: action.payload }

    case "ADD_TRANSACTION":
      return {
        ...state,
        recentTransactions: [action.payload, ...state.recentTransactions].slice(0, 10),
      }

    case "UPDATE_USER_BALANCE":
      return {
        ...state,
        user: state.user ? { ...state.user, balance: action.payload } : null,
      }

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case "SET_THEME":
      return { ...state, theme: action.payload }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>

  // Helper functions
  login: (user: User) => void
  logout: () => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (product: Product) => void
  updateUserBalance: (newBalance: number) => void
  addTransaction: (transaction: Transaction) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize app state on mount
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: "SET_LOADING", payload: true })

      // Check for existing user session
      // const currentUser = authService.getCurrentUser()
      // if (currentUser) {
      //   dispatch({ type: "SET_USER", payload: currentUser })
      // }

      // Load cart from localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart)
          dispatch({ type: "SET_CART", payload: cart })
        } catch (error) {
          console.error("Failed to load cart from localStorage:", error)
        }
      }

      // Load wishlist from localStorage
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        try {
          const wishlist = JSON.parse(savedWishlist)
          dispatch({ type: "SET_WISHLIST", payload: wishlist })
        } catch (error) {
          console.error("Failed to load wishlist from localStorage:", error)
        }
      }

      // Load theme preference
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
      if (savedTheme) {
        dispatch({ type: "SET_THEME", payload: savedTheme })
      }

      dispatch({ type: "SET_LOADING", payload: false })
    }

    initializeApp()
  }, [])

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart))
  }, [state.cart])

  // Sync wishlist with localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist))
  }, [state.wishlist])

  // Sync theme with localStorage and document
  useEffect(() => {
    localStorage.setItem("theme", state.theme)
    document.documentElement.classList.toggle("dark", state.theme === "dark")
  }, [state.theme])

  // Helper functions
  const login = (user: User) => {
    dispatch({ type: "SET_USER", payload: user })
  }

  const logout = () => {
    dispatch({ type: "SET_USER", payload: null })
    dispatch({ type: "CLEAR_CART" })
    dispatch({ type: "SET_WISHLIST", payload: [] })
    dispatch({ type: "SET_USER_GROUPS", payload: [] })
    dispatch({ type: "SET_PAYMENT_METHODS", payload: [] })
    dispatch({ type: "SET_RECENT_TRANSACTIONS", payload: [] })
  }

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleWishlist = (product: Product) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: product })
  }

  const updateUserBalance = (newBalance: number) => {
    dispatch({ type: "UPDATE_USER_BALANCE", payload: newBalance })
  }

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction })
  }

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    updateUserBalance,
    addTransaction,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
