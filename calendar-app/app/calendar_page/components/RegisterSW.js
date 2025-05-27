// components/RegisterSW.js
'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          //console.log('✅ Service Worker зарегистрирован:', reg)
        })
        .catch((err) => {
          //console.error('❌ Ошибка регистрации Service Worker:', err)
        })
    }
  }, [])

  return null
}
