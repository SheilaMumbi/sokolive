const nf = new Intl.NumberFormat('en-KE')
export const kes = (n: number) => `KES ${nf.format(n)}`
