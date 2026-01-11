'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { FeaturedProductCard } from './FeaturedProductCard'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  priority: number
  productCount: number
  subcategories?: Category[]
}

interface FeaturedProduct {
  id: string
  name: string
  slug: string
  category: string
  description: string
}

interface CategoryNavigationProps {
  onCategorySelect?: (category: Category) => void
  isLoading?: boolean
}

// Category icons mapping based on slug/name patterns
const categoryIcons: Record<string, JSX.Element> = {
  // Filters
  'filtry': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  'filters': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  // Hydraulics
  'hydraulika': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  'hydraulics': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  // Engine parts
  'silnik': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'engine': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  // Undercarriage / tracks
  'podwozie': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  'gasienice': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  'undercarriage': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  // Electrical
  'elektryka': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  'electrical': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  // Cabin / operator
  'kabina': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  'cabin': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  // Buckets / attachments
  'lyżki': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  'buckets': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  'osprzet': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  // Brakes
  'hamulce': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  'brakes': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  // Transmission
  'skrzynia': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L6.75 2.906m9.944 18.08l-1.15-.964M5.255 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514" /></svg>,
  'transmission': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L6.75 2.906m9.944 18.08l-1.15-.964M5.255 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514" /></svg>,
  // Cooling
  'chlodzenie': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3" /></svg>,
  'cooling': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3" /></svg>,
  // Seals / gaskets
  'uszczelki': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" /></svg>,
  'seals': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" /></svg>,
  // Bearings
  'lozyska': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'bearings': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  // Tools
  'narzedzia': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
  'tools': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
  // Default
  'default': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
}

// Small category icons for level 3 subcategories
const categoryIconsSmall: Record<string, JSX.Element> = {
  'filtry': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  'filters': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  'hydraulika': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  'silnik': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'podwozie': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  'elektryka': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  'kabina': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  'lyżki': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  'hamulce': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  'skrzynia': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21" /></svg>,
  'chlodzenie': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18" /></svg>,
  'uszczelki': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" /></svg>,
  'lozyska': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'narzedzia': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
  'default': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>,
}

// Helper function to get icon for category
const getCategoryIcon = (category: Category): JSX.Element => {
  const slug = category.slug?.toLowerCase() || ''
  const name = category.name?.toLowerCase() || ''
  
  // Check slug first, then name
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (slug.includes(key) || name.includes(key)) {
      return icon
    }
  }
  
  return categoryIcons['default']
}

// Helper function to get small icon for level 3 subcategories
const getCategoryIconSmall = (category: Category): JSX.Element => {
  const slug = category.slug?.toLowerCase() || ''
  const name = category.name?.toLowerCase() || ''
  
  for (const [key, icon] of Object.entries(categoryIconsSmall)) {
    if (slug.includes(key) || name.includes(key)) {
      return icon
    }
  }
  
  return categoryIconsSmall['default']
}

export function CategoryNavigation({ onCategorySelect }: CategoryNavigationProps) {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredProductsError, setFeaturedProductsError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredLevel1, setHoveredLevel1] = useState<string | null>(null)
  const [hoveredLevel2, setHoveredLevel2] = useState<string | null>(null)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)

  // Fetch full category hierarchy on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/categories/hierarchy', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }

        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('failedToLoadCategories')
        setError(errorMessage)
        console.error('Error fetching categories:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch featured products on mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setFeaturedProductsError(null)

        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (apiKey) {
          headers['x-publishable-api-key'] = apiKey
        }
        
        const response = await fetch(`${backendUrl}/store/products?limit=6`, {
          method: 'GET',
          headers,
        })

        if (!response.ok) {
          console.warn('Featured products API returned error, using empty array')
          setFeaturedProducts([])
          return
        }

        const data = await response.json()
        setFeaturedProducts(data.products || [])
      } catch (err) {
        console.warn('Error fetching featured products, using empty array:', err)
        setFeaturedProducts([])
      }
    }

    fetchFeaturedProducts()
  }, [locale])

  const handleMenuOpen = () => {
    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    setIsMenuOpen(true)
  }

  const handleMenuClose = () => {
    // Add delay before closing to allow mouse to move to menu
    const timeout = setTimeout(() => {
      setIsMenuOpen(false)
      setHoveredLevel1(null)
      setHoveredLevel2(null)
    }, 150)
    setCloseTimeout(timeout)
  }

  const handleMenuEnter = () => {
    // Cancel close when entering menu
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
  }

  const handleCategorySelect = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    handleMenuClose()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center px-3 py-2">
        <div className="h-4 w-20 bg-white/30 rounded animate-pulse" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center px-3 py-2 text-sm text-white/70">
        <span>PRODUKTY</span>
      </div>
    )
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="flex items-center px-3 py-2 text-sm text-white/70">
        <span>PRODUKTY</span>
      </div>
    )
  }

  return (
    <div 
      className="nav-item relative"
      onMouseEnter={handleMenuOpen}
      onMouseLeave={handleMenuClose}
    >
      <button
        className="nav-item__trigger flex items-center gap-1 text-white font-bold hover:text-secondary-700 transition-colors px-3 py-6 text-sm uppercase font-heading"
      >
        PRODUKTY
      </button>

      {/* Mega menu - fixed position under header */}
      {isMenuOpen && (
        <>
          {/* Invisible bridge to prevent hover gap */}
          <div 
            className="fixed left-0 right-0 h-4 z-40" 
            style={{ top: '60px' }}
            onMouseEnter={handleMenuEnter}
          />
          <div
            className="mega-menu fixed bg-secondary-800 shadow-2xl z-50 overflow-hidden rounded-b-lg"
            style={{ 
              top: '64px',
              maxHeight: 'calc(100vh - 54px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 96px)',
              maxWidth: '1352px'
            }}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuClose}
          >
            <div className="flex" style={{ maxHeight: 'calc(100vh - 54px)' }}>
            {/* Left sidebar - Main Categories */}
            <div className="w-64 bg-secondary-900 py-4 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 54px)' }}>
              <div className="px-6 mb-4">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
                  {t('categories')}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onMouseEnter={() => {
                      setHoveredLevel1(category.id)
                      setHoveredLevel2(null)
                    }}
                    onClick={() => {
                      handleCategorySelect(category)
                      window.location.href = `/${locale}/categories/${category.slug}`
                    }}
                    className={`w-full text-left px-6 py-3 text-sm font-medium transition-all duration-150 flex items-center justify-between group ${
                      hoveredLevel1 === category.id
                        ? 'bg-primary-500 text-white'
                        : 'text-neutral-300 hover:bg-secondary-700 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`${hoveredLevel1 === category.id ? 'text-white' : 'text-primary-400'}`}>
                        {getCategoryIcon(category)}
                      </span>
                      {category.name}
                    </span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <svg 
                        className={`w-4 h-4 transition-transform ${hoveredLevel1 === category.id ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {/* View All Link */}
              <div className="px-6 pt-4 border-t border-secondary-700">
                <Link
                  href={`/${locale}/categories`}
                  onClick={handleMenuClose}
                  className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  {t('viewAllCategories')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right content area - Subcategories in grid */}
            <div className="flex-1 py-4 px-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 54px)' }}>
              {hoveredLevel1 ? (
                <>
                  {/* Category header */}
                  <div className="mb-6">
                    <h2 className="text-white text-xl font-semibold mb-1">
                      {categories.find(cat => cat.id === hoveredLevel1)?.name}
                    </h2>
                    <p className="text-neutral-400 text-sm">
                      {categories.find(cat => cat.id === hoveredLevel1)?.description || 
                       `${categories.find(cat => cat.id === hoveredLevel1)?.productCount || 0} ${t('products')}`}
                    </p>
                  </div>

                  {/* Subcategories grid */}
                  {categories.find(cat => cat.id === hoveredLevel1)?.subcategories && 
                   categories.find(cat => cat.id === hoveredLevel1)!.subcategories!.length > 0 ? (
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                      {categories
                        .find(cat => cat.id === hoveredLevel1)
                        ?.subcategories?.map((subcategory) => (
                          <div key={subcategory.id} className="space-y-2">
                            <Link
                              href={`/${locale}/categories/${subcategory.slug}`}
                              onClick={() => handleCategorySelect(subcategory)}
                              className="text-white font-semibold text-sm hover:text-primary-400 transition-colors flex items-center gap-2 group/sub"
                            >
                              <span className="text-primary-400 group-hover/sub:text-primary-300 transition-colors">
                                {getCategoryIcon(subcategory)}
                              </span>
                              {subcategory.name}
                            </Link>
                            {/* Level 3 subcategories */}
                            {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                              <div className="space-y-1 pl-7">
                                {subcategory.subcategories.slice(0, 5).map((subSub) => (
                                  <Link
                                    key={subSub.id}
                                    href={`/${locale}/categories/${subSub.slug}`}
                                    onClick={() => handleCategorySelect(subSub)}
                                    className="flex items-center gap-2 text-neutral-400 text-sm hover:text-primary-400 transition-colors py-0.5 group/subsub"
                                  >
                                    <span className="text-neutral-500 group-hover/subsub:text-primary-400 transition-colors">
                                      {getCategoryIconSmall(subSub)}
                                    </span>
                                    {subSub.name}
                                  </Link>
                                ))}
                                {subcategory.subcategories.length > 5 && (
                                  <Link
                                    href={`/${locale}/categories/${subcategory.slug}`}
                                    onClick={() => handleCategorySelect(subcategory)}
                                    className="flex items-center gap-2 text-primary-400 text-sm hover:text-primary-300 transition-colors py-0.5 font-medium"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    +{subcategory.subcategories.length - 5} {t('viewAll')}
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-neutral-400 text-sm">
                      <Link
                        href={`/${locale}/categories/${categories.find(cat => cat.id === hoveredLevel1)?.slug}`}
                        onClick={handleMenuClose}
                        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium"
                      >
                        {t('viewAllProducts')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                /* Default state - show featured or popular categories */
                <div>
                  <h2 className="text-white text-xl font-semibold mb-6">
                    {t('discoverOurProducts')}
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/${locale}/categories/${category.slug}`}
                        onClick={() => handleCategorySelect(category)}
                        onMouseEnter={() => setHoveredLevel1(category.id)}
                        className="group p-4 bg-secondary-700/50 rounded-lg hover:bg-secondary-700 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-primary-400 group-hover:text-primary-300 transition-colors">
                            {getCategoryIcon(category)}
                          </span>
                          <h3 className="text-white font-semibold text-sm group-hover:text-primary-400 transition-colors">
                            {category.name}
                          </h3>
                        </div>
                        <p className="text-neutral-500 text-xs">
                          {category.productCount} {t('products')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  )
}
