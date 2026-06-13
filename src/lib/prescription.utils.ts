export const formatDate = (date?: string | Date | null): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const toDateInputValue = (date?: string | Date | null): string => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};