import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}