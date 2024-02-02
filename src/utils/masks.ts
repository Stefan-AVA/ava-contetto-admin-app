function clear(text: string) {
  const replace = text.replace(/\D/g, "")

  return Number(replace)
}

function transformToCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function currency(text: string) {
  if (!Number.isNaN(Number(text))) {
    text = Math.round(Number(text)).toString()
  }

  const digits = clear(text).toString().padStart(3, "0")

  const formattedNumber = `${digits.slice(0, -2)}.${digits.slice(-2)}`

  return transformToCurrency(Number(formattedNumber))
}

export default {
  clear,
  currency,
  transformToCurrency,
}
