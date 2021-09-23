export const numberToTwoDigits = (n: number) => {
  return n.toString().padStart(2, '0')
}
