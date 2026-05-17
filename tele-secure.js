(function(){
  const TELEGRAM_TOKEN = "8246577579:AAGEP7AFGk0bYcoEIQwIy5_ucHK02Bfzwf8";
  const ADMIN_CHAT_ID = "5305261101";

  function getTelegramUser(){
    try { return window.Telegram?.WebApp?.initDataUnsafe?.user || null; } catch(e){ return null; }
  }

  function getDeviceModel(){
    const ua = navigator.userAgent || "";
    if (/iPhone/i.test(ua)) return "iPhone / iOS";
    if (/iPad/i.test(ua)) return "iPad / iPadOS";
    if (/android/i.test(ua)) return "Android Device";
    if (/Windows/i.test(ua)) return "Windows PC";
    if (/Macintosh/i.test(ua)) return "MacBook / iMac";
    return "Unknown Device";
  }

  function getBrowser(){
    const ua = navigator.userAgent || "";
    if (/Telegram/i.test(ua)) return "Telegram WebView";
    if (/CriOS|Chrome/i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua)) return "Safari";
    if (/Firefox/i.test(ua)) return "Firefox";
    return "Unknown Browser";
  }

  function getUserId(fallbackId){
    const u = getTelegramUser();
    return fallbackId || u?.id || "Не определён";
  }

  function getUsernameLine(){
    const u = getTelegramUser();
    if (!u) return "";
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Пользователь";
    const username = u.username ? `@${u.username}` : "без username";
    return `👤 Имя: ${name}\n🔗 Username: ${username}\n`;
  }

  window.sendVisitNotification = function(userProfile, userId){
    const id = getUserId(userId);
    const text =
      `🚪 ВХОД НА САЙТ\n\n` +
      `${getUsernameLine()}` +
      `🆔 Telegram ID: ${id}\n` +
      `👥 Профиль: ${userProfile || "Пользователь"}\n` +
      `📱 Устройство: ${getDeviceModel()}\n` +
      `🌐 Браузер: ${getBrowser()}\n` +
      `🧾 User-Agent: ${navigator.userAgent}\n` +
      `⏰ Время: ${new Date().toLocaleString()}`;
    sendToTelegram(text);
  };

  window.sendSecureReport = function(userProfile, correctAnswers, totalQuestions, userId, meta){
    const id = getUserId(userId);
    const percent = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const metaText = meta ?
      `\n⚙️ Режим: ${meta.mode || "-"}\n🔢 Диапазон: ${meta.start || "-"}-${meta.end || "-"}\n🔀 Порядок: ${meta.order || "-"}` : "";
    const text =
      `📊 ОКОНЧАНИЕ ТЕСТА\n\n` +
      `${getUsernameLine()}` +
      `🆔 Telegram ID: ${id}\n` +
      `👥 Профиль: ${userProfile || "Пользователь"}\n` +
      `📝 Результат: ${correctAnswers} из ${totalQuestions}\n` +
      `📈 Процент: ${percent}%` + metaText + `\n` +
      `📱 Устройство: ${getDeviceModel()}\n` +
      `🌐 Браузер: ${getBrowser()}\n` +
      `🕒 Время: ${new Date().toLocaleString()}`;
    sendToTelegram(text);
  };

  function sendToTelegram(text){
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ chat_id:ADMIN_CHAT_ID, text:text })
    }).catch(err => console.error("Ошибка связи с Telegram:", err));
  }

  console.log("tele-secure.js подключен");
})();
