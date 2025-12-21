'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

// SVG Icons
const MapPinIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ChatIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const QuestionIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

export default function ContactPage() {
  const locale = useLocale()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-12 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-secondary-500">
          <Link href={`/${locale}`} className="text-primary-500 hover:underline">Strona główna</Link>
          {' / '}
          <span>Kontakt</span>
        </div>

        {/* Hero */}
        <div className="bg-secondary-700 rounded-lg p-8 lg:p-16 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
          <span className="text-primary-500 uppercase tracking-widest font-bold text-sm">Napisz do nas</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 font-heading">
            Skontaktuj Się z <span className="text-primary-500">Nami</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Masz pytania? Zostaw nam wiadomość. Odpowiemy najszybciej jak będzie to możliwe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-secondary-700 mb-6">Formularz Kontaktowy</h2>

            {submitted && (
              <div className="p-4 bg-green-100 text-green-800 rounded-lg mb-6 flex items-center gap-3">
                <CheckIcon />
                <span>Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy wkrótce.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Imię i nazwisko *</label>
                <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Jan Kowalski" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="jan@example.com" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Telefon</label>
                  <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+48 500 169 060" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Temat *</label>
                <select value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)} required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">Wybierz temat</option>
                  <option value="general">Pytanie ogólne</option>
                  <option value="order">Pytanie o zamówienie</option>
                  <option value="product">Pytanie o produkt</option>
                  <option value="technical">Wsparcie techniczne</option>
                  <option value="partnership">Współpraca B2B</option>
                  <option value="other">Inne</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Wiadomość *</label>
                <textarea value={formData.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Opisz swoją sprawę..." required rows={6} className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-primary-500 text-white rounded-lg font-bold hover:bg-primary-600 disabled:bg-neutral-400 transition-colors">
                {loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-secondary-700 mb-6">Dane Kontaktowe</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <MapPinIcon />
                  </div>
                  <div>
                    <div className="text-sm text-secondary-400 mb-1">Siedziba Firmy</div>
                    <div className="font-semibold text-secondary-700">OMEX<br />ul. Gnieźnieńska 19<br />62-300 Września</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <PhoneIcon />
                  </div>
                  <div>
                    <div className="text-sm text-secondary-400 mb-1">Telefony</div>
                    <div className="font-semibold text-secondary-700 space-y-1">
                      <a href="tel:+48500169060" className="block hover:text-primary-500">+48 500 169 060</a>
                      <a href="tel:+48505039525" className="block hover:text-primary-500">+48 505 039 525</a>
                      <a href="tel:+48535000585" className="block hover:text-primary-500">+48 535 000 585</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <MailIcon />
                  </div>
                  <div>
                    <div className="text-sm text-secondary-400 mb-1">Email</div>
                    <div className="font-semibold text-secondary-700 space-y-1">
                      <a href="mailto:omexplus@gmail.com" className="block hover:text-primary-500">omexplus@gmail.com</a>
                      <a href="mailto:czesci.omex@gmail.com" className="block hover:text-primary-500">czesci.omex@gmail.com</a>
                      <a href="mailto:kolaiwalki@gmail.com" className="block hover:text-primary-500">kolaiwalki@gmail.com</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <ClockIcon />
                  </div>
                  <div>
                    <div className="text-sm text-secondary-400 mb-1">Godziny pracy</div>
                    <div className="font-semibold text-secondary-700">Pon - Pt: 8:00 - 16:00<br />Sob - Niedz: Nieczynne</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-lg overflow-hidden h-64">
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9751.581525896978!2d17.563591!3d52.336044!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x2167d2a3c5200502!2sOmex!5e0!3m2!1spl!2spl!4v1672428924287!5m2!1spl!2spl" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center text-white">
              <ChatIcon />
            </div>
            <h3 className="font-bold text-secondary-700 mb-2">Live Chat</h3>
            <p className="text-secondary-500 text-sm mb-4">Porozmawiaj z nami na żywo</p>
            <button className="px-6 py-2 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors">Rozpocznij chat</button>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center text-white">
              <QuestionIcon />
            </div>
            <h3 className="font-bold text-secondary-700 mb-2">FAQ</h3>
            <p className="text-secondary-500 text-sm mb-4">Znajdź odpowiedzi na pytania</p>
            <Link href={`/${locale}/faq`} className="inline-block px-6 py-2 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors">Zobacz FAQ</Link>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border-t-4 border-primary-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center text-white">
              <BuildingIcon />
            </div>
            <h3 className="font-bold text-secondary-700 mb-2">Współpraca B2B</h3>
            <p className="text-secondary-500 text-sm mb-4">Oferta dla firm</p>
            <button className="px-6 py-2 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors">Dowiedz się więcej</button>
          </div>
        </div>
      </div>
    </div>
  )
}
