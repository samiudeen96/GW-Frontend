import { useT } from "@/lib/i18n";

export function WhatsAppChat() {
  const t = useT();
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=97180044674";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("misc.whatsapp.ariaLabel", "Chat on WhatsApp")}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group flex items-center justify-center w-11 h-11 md:w-14 md:h-14 bg-forest text-brass border border-brass/70 shadow-md hover:shadow-lg hover:bg-forest-dark hover:border-brass transition-all duration-300"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-brass"
      >
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
      </svg>
    </a>
  );
}
