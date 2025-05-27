// components/PWAInstallPrompt.js
"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // блокируем автоматическое появление баннера
      setDeferredPrompt(e);
      setShowInstall(true); // показываем кнопку
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // запускаем установку
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("Пользователь установил PWA");
    } else {
      console.log("Пользователь отказался от установки PWA");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <button onClick={handleInstallClick} className="pwa-install-button">
      Установить приложение
    </button>
  );
}
