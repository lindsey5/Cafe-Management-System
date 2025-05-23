import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}