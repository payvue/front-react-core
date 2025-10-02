export const phoneFormater = (value: string) => {
    const digits = value.replace(/\D/g, "")
    let formatted = digits
    if (digits.length < 4) {
      formatted = digits
    } else if (digits.length < 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`
    } else if (digits.length <= 11) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    } else {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
    }

    return formatted
  }