'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer bg-neutral-900 text-white">
      <div className="footer__content container mx-auto px-4 md:px-[60px] py-12 md:py-16">
        <div className="footer__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="footer__brand lg:col-span-2">
            <Link href="/pl" className="footer__logo inline-block mb-4">
              <span className="text-2xl font-extrabold">OMEX</span>
            </Link>
            <p className="footer__description text-[14px] text-neutral-400 leading-relaxed mb-6 max-w-sm">
              Your trusted partner in supplying spare parts for construction machinery. Highest quality, competitive prices, fast delivery.
            </p>
            
            <div className="footer__socials flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer__section">
            <h3 className="footer__section-title text-[14px] font-semibold mb-4">Shop</h3>
            <ul className="footer__links space-y-3">
              <li>
                <Link href="/pl/products" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/pl/categories" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/pl/promotions" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/pl/new" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  New arrivals
                </Link>
              </li>
              <li>
                <Link href="/pl/bestsellers" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="footer__section">
            <h3 className="footer__section-title text-[14px] font-semibold mb-4">Customer Service</h3>
            <ul className="footer__links space-y-3">
              <li>
                <Link href="/pl/contact" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pl/faq" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pl/tracking" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Track package
                </Link>
              </li>
              <li>
                <Link href="/pl/returns" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Returns & claims
                </Link>
              </li>
              <li>
                <Link href="/pl/shipping" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Shipping & payment
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="footer__section">
            <h3 className="footer__section-title text-[14px] font-semibold mb-4">Company</h3>
            <ul className="footer__links space-y-3">
              <li>
                <Link href="/pl/about" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/pl/careers" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/pl/blog" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/pl/terms" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/pl/privacy" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer__bottom border-t border-neutral-800">
        <div className="container mx-auto px-4 md:px-[60px] py-6">
          <div className="footer__bottom-content flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="footer__copyright text-[13px] text-neutral-400">
              © 2024 OMEX. All rights reserved.
            </p>
            
            <div className="footer__payments flex items-center gap-3">
              <span className="footer__payments-label text-[13px] text-neutral-400">We accept:</span>
              <div className="footer__payment-methods flex gap-2">
                <div className="w-10 h-7 bg-white rounded flex items-center justify-center text-[10px] font-bold">
                  VISA
                </div>
                <div className="w-10 h-7 bg-white rounded flex items-center justify-center text-[10px] font-bold">
                  MC
                </div>
                <div className="w-10 h-7 bg-white rounded flex items-center justify-center text-[10px] font-bold">
                  BLIK
                </div>
                <div className="w-10 h-7 bg-white rounded flex items-center justify-center text-[10px] font-bold">
                  P24
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
