export function toLocalInputValue(isoString: string) {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromLocalInputValue(value: string) {
  if (!value.trim()) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

export function localDateToUtcBoundary(dateValue: string, boundary: "start" | "end") {
  if (!dateValue.trim()) {
    return "";
  }

  const time = boundary === "start" ? "T00:00:00.000" : "T23:59:59.999";
  const date = new Date(`${dateValue}${time}`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

export function formatDateTime(isoString: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}
