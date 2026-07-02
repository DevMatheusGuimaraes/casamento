import type { ReactNode } from 'react'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export default function PresentesLayout({ children }: { children: ReactNode }) {
  return <section className={`${cormorant.variable} ${montserrat.variable}`}>{children}</section>
}
