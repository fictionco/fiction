export type IconCategory = 'interface' | 'content' | 'commerce' | 'media' | 'social' | 'marketing'

export const recommendedIcons = [
  // ESSENTIAL - Used constantly in web interfaces
  { class: 'i-tabler-menu-2', category: 'interface' },
  { class: 'i-tabler-x', category: 'interface' },
  { class: 'i-tabler-search', category: 'interface' },
  { class: 'i-tabler-plus', category: 'interface' },
  { class: 'i-tabler-minus', category: 'interface' },
  { class: 'i-tabler-check', category: 'interface' },
  { class: 'i-tabler-edit', category: 'interface' },
  { class: 'i-tabler-trash', category: 'interface' },
  { class: 'i-tabler-settings', category: 'interface' },
  { class: 'i-tabler-eye', category: 'interface' },
  { class: 'i-tabler-eye-off', category: 'interface' },
  { class: 'i-tabler-chevron-down', category: 'interface' },
  { class: 'i-tabler-chevron-up', category: 'interface' },
  { class: 'i-tabler-chevron-left', category: 'interface' },
  { class: 'i-tabler-chevron-right', category: 'interface' },
  { class: 'i-tabler-arrow-left', category: 'interface' },
  { class: 'i-tabler-arrow-right', category: 'interface' },
  { class: 'i-tabler-dots', category: 'interface' },
  { class: 'i-tabler-dots-vertical', category: 'interface' },
  { class: 'i-tabler-copy', category: 'interface' },
  { class: 'i-tabler-download', category: 'interface' },
  { class: 'i-tabler-upload', category: 'interface' },
  { class: 'i-tabler-external-link', category: 'interface' },
  { class: 'i-tabler-link', category: 'interface' },
  { class: 'i-tabler-help', category: 'interface' },

  // CORE CONTENT & FILE MANAGEMENT
  { class: 'i-tabler-file', category: 'content' },
  { class: 'i-tabler-folder', category: 'content' },
  { class: 'i-tabler-photo', category: 'media' },
  { class: 'i-tabler-video', category: 'media' },
  { class: 'i-tabler-files', category: 'content' },
  { class: 'i-tabler-template', category: 'content' },
  { class: 'i-tabler-layout-grid', category: 'interface' },

  // CORE SOCIAL & COMMUNICATION
  { class: 'i-tabler-mail', category: 'social' },
  { class: 'i-tabler-send', category: 'social' },
  { class: 'i-tabler-user', category: 'social' },
  { class: 'i-tabler-users', category: 'social' },
  { class: 'i-tabler-message', category: 'social' },
  { class: 'i-tabler-phone', category: 'social' },
  { class: 'i-tabler-share', category: 'social' },

  // COMMON INTERFACE CONTROLS
  { class: 'i-tabler-refresh', category: 'interface' },
  { class: 'i-tabler-filter', category: 'interface' },
  { class: 'i-tabler-sort-ascending', category: 'interface' },
  { class: 'i-tabler-drag-drop', category: 'interface' },
  { class: 'i-tabler-maximize', category: 'interface' },
  { class: 'i-tabler-minimize', category: 'interface' },
  { class: 'i-tabler-lock', category: 'interface' },
  { class: 'i-tabler-lock-open', category: 'interface' },
  { class: 'i-tabler-pin', category: 'interface' },
  { class: 'i-tabler-settings-2', category: 'interface' },
  { class: 'i-tabler-reload', category: 'interface' },
  { class: 'i-tabler-circle-check', category: 'interface' },

  // CONTENT EDITING
  { class: 'i-tabler-bold', category: 'content' },
  { class: 'i-tabler-italic', category: 'content' },
  { class: 'i-tabler-underline', category: 'content' },
  { class: 'i-tabler-align-left', category: 'content' },
  { class: 'i-tabler-align-center', category: 'content' },
  { class: 'i-tabler-align-right', category: 'content' },
  { class: 'i-tabler-list', category: 'content' },
  { class: 'i-tabler-list-numbers', category: 'content' },
  { class: 'i-tabler-h-1', category: 'content' },
  { class: 'i-tabler-h-2', category: 'content' },
  { class: 'i-tabler-h-3', category: 'content' },
  { class: 'i-tabler-quote', category: 'content' },
  { class: 'i-tabler-text-size', category: 'content' },

  // LAYOUT & DESIGN
  { class: 'i-tabler-layout-list', category: 'interface' },
  { class: 'i-tabler-layout-cards', category: 'interface' },
  { class: 'i-tabler-layout-columns', category: 'interface' },
  { class: 'i-tabler-layout-dashboard', category: 'interface' },
  { class: 'i-tabler-layout', category: 'content' },
  { class: 'i-tabler-grid', category: 'content' },
  { class: 'i-tabler-palette', category: 'interface' },
  { class: 'i-tabler-color-picker', category: 'content' },

  // FORMS & INPUTS
  { class: 'i-tabler-checkbox', category: 'interface' },
  { class: 'i-tabler-radio', category: 'interface' },
  { class: 'i-tabler-switch', category: 'interface' },

  // MEDIA CONTROLS
  { class: 'i-tabler-player-play', category: 'media' },
  { class: 'i-tabler-player-pause', category: 'media' },
  { class: 'i-tabler-player-stop', category: 'media' },
  { class: 'i-tabler-camera', category: 'media' },
  { class: 'i-tabler-volume', category: 'media' },
  { class: 'i-tabler-volume-off', category: 'media' },

  // POPULAR SOCIAL BRANDS
  { class: 'i-tabler-brand-facebook', category: 'social' },
  { class: 'i-tabler-brand-x', category: 'social' },
  { class: 'i-tabler-brand-instagram', category: 'social' },
  { class: 'i-tabler-brand-linkedin', category: 'social' },
  { class: 'i-tabler-brand-youtube', category: 'social' },
  { class: 'i-tabler-brand-google-filled', category: 'social' },

  // MARKETING ESSENTIALS
  { class: 'i-tabler-chart-line', category: 'marketing' },
  { class: 'i-tabler-chart-bar', category: 'marketing' },
  { class: 'i-tabler-target', category: 'marketing' },
  { class: 'i-tabler-speakerphone', category: 'marketing' },
  { class: 'i-tabler-mail-fast', category: 'marketing' },
  { class: 'i-tabler-calendar', category: 'marketing' },

  // COMMONLY USED INTERFACE
  { class: 'i-tabler-arrow-up', category: 'interface' },
  { class: 'i-tabler-arrow-down', category: 'interface' },
  { class: 'i-tabler-unlink', category: 'interface' },
  { class: 'i-tabler-bell', category: 'interface' },
  { class: 'i-tabler-star', category: 'social' },
  { class: 'i-tabler-heart', category: 'social' },
  { class: 'i-tabler-bookmark', category: 'social' },
  { class: 'i-tabler-shield', category: 'interface' },
  { class: 'i-tabler-bolt', category: 'interface' },
  { class: 'i-tabler-bulb', category: 'interface' },
  { class: 'i-tabler-rocket', category: 'interface' },

  // USEFUL CONTENT TOOLS
  { class: 'i-tabler-article', category: 'content' },
  { class: 'i-tabler-book', category: 'content' },
  { class: 'i-tabler-notes', category: 'content' },
  { class: 'i-tabler-clipboard', category: 'content' },
  { class: 'i-tabler-code', category: 'content' },
  { class: 'i-tabler-strikethrough', category: 'content' },
  { class: 'i-tabler-align-justified', category: 'content' },
  { class: 'i-tabler-list-check', category: 'content' },
  { class: 'i-tabler-markdown', category: 'content' },
  { class: 'i-tabler-pencil', category: 'content' },

  // COMMERCE BASICS
  { class: 'i-tabler-shopping-cart', category: 'commerce' },
  { class: 'i-tabler-credit-card', category: 'commerce' },
  { class: 'i-tabler-currency-dollar', category: 'commerce' },
  { class: 'i-tabler-tag', category: 'commerce' },
  { class: 'i-tabler-gift', category: 'commerce' },

  // USEFUL NAVIGATION & USER ACTIONS
  { class: 'i-tabler-login', category: 'interface' },
  { class: 'i-tabler-logout', category: 'interface' },
  { class: 'i-tabler-user-plus', category: 'social' },
  { class: 'i-tabler-user-check', category: 'social' },
  { class: 'i-tabler-messages', category: 'social' },
  { class: 'i-tabler-printer', category: 'interface' },

  // ADDITIONAL MARKETING TOOLS
  { class: 'i-tabler-presentation', category: 'marketing' },
  { class: 'i-tabler-chart-pie', category: 'marketing' },
  { class: 'i-tabler-trending-up', category: 'marketing' },
  { class: 'i-tabler-briefcase', category: 'marketing' },
  { class: 'i-tabler-trophy', category: 'marketing' },
  { class: 'i-tabler-address-book', category: 'marketing' },

  // EXTENDED SOCIAL PLATFORMS
  { class: 'i-tabler-brand-github', category: 'social' },
  { class: 'i-tabler-brand-discord', category: 'social' },
  { class: 'i-tabler-brand-tiktok', category: 'social' },
  { class: 'i-tabler-brand-whatsapp', category: 'social' },
  { class: 'i-tabler-brand-telegram', category: 'social' },
  { class: 'i-tabler-brand-slack', category: 'social' },

  // USEFUL INTERFACE ADDITIONS
  { class: 'i-tabler-activity', category: 'interface' },
  { class: 'i-tabler-sparkles', category: 'interface' },
  { class: 'i-tabler-focus', category: 'interface' },
  { class: 'i-tabler-target', category: 'interface' },
  { class: 'i-tabler-compass', category: 'interface' },
  { class: 'i-tabler-world', category: 'interface' },

  // EXTENDED LAYOUT OPTIONS
  { class: 'i-tabler-layout-board', category: 'interface' },
  { class: 'i-tabler-layout-rows', category: 'interface' },
  { class: 'i-tabler-layout-sidebar', category: 'interface' },
  { class: 'i-tabler-layout-navbar', category: 'interface' },
  { class: 'i-tabler-layout-bottombar', category: 'interface' },

  // ADDITIONAL MEDIA TOOLS
  { class: 'i-tabler-photo-edit', category: 'media' },
  { class: 'i-tabler-crop', category: 'media' },
  { class: 'i-tabler-rotate', category: 'media' },
  { class: 'i-tabler-brightness', category: 'media' },
  { class: 'i-tabler-contrast', category: 'media' },
  { class: 'i-tabler-volume-2', category: 'media' },
  { class: 'i-tabler-volume-3', category: 'media' },
  { class: 'i-tabler-microphone', category: 'media' },

  // EXTENDED CONTENT TOOLS
  { class: 'i-tabler-components', category: 'content' },
  { class: 'i-tabler-brush', category: 'content' },
  { class: 'i-tabler-highlight', category: 'content' },
  { class: 'i-tabler-section', category: 'content' },
  { class: 'i-tabler-brackets', category: 'content' },

  // MORE COMMERCE OPTIONS
  { class: 'i-tabler-shopping-bag', category: 'commerce' },
  { class: 'i-tabler-receipt', category: 'commerce' },
  { class: 'i-tabler-discount', category: 'commerce' },
  { class: 'i-tabler-package', category: 'commerce' },
  { class: 'i-tabler-truck-delivery', category: 'commerce' },

  // SPECIALIZED MARKETING
  { class: 'i-tabler-chart-dots', category: 'marketing' },
  { class: 'i-tabler-telescope', category: 'marketing' },
  { class: 'i-tabler-certificate', category: 'marketing' },
  { class: 'i-tabler-mail-forward', category: 'marketing' },
  { class: 'i-tabler-mail-opened', category: 'marketing' },
  { class: 'i-tabler-mailbox', category: 'marketing' },
  { class: 'i-tabler-seo', category: 'marketing' },

  // SPECIALIZED INTERFACE
  { class: 'i-tabler-browser', category: 'interface' },
  { class: 'i-tabler-terminal', category: 'media' },
  { class: 'i-tabler-webhook', category: 'interface' },
  { class: 'i-tabler-api', category: 'interface' },
  { class: 'i-tabler-database', category: 'interface' },
  { class: 'i-tabler-cloud', category: 'interface' },

  // ADVANCED FEATURES
  { class: 'i-tabler-adjustments', category: 'interface' },
  { class: 'i-tabler-settings-cog', category: 'interface' },
  { class: 'i-tabler-puzzle', category: 'interface' },
  { class: 'i-tabler-cube', category: 'interface' },
  { class: 'i-tabler-layers-intersect', category: 'interface' },
  { class: 'i-tabler-vector-triangle', category: 'interface' },

  // SPECIALIZED SOCIAL
  { class: 'i-tabler-rss', category: 'social' },
  { class: 'i-tabler-share-2', category: 'social' },
  { class: 'i-tabler-at', category: 'social' },
  { class: 'i-tabler-hash', category: 'social' },
  { class: 'i-tabler-thumb-up', category: 'social' },
  { class: 'i-tabler-thumb-down', category: 'social' },

  // NICHE BRANDS & PLATFORMS
  { class: 'i-tabler-brand-reddit', category: 'social' },
  { class: 'i-tabler-brand-apple', category: 'social' },
  { class: 'i-tabler-brand-paypal', category: 'social' },
  { class: 'i-tabler-brand-dribbble', category: 'social' },
  { class: 'i-tabler-brand-snapchat', category: 'social' },
  { class: 'i-tabler-brand-soundcloud', category: 'social' },

  // EXTENDED MARKETING ANALYTICS
  { class: 'i-tabler-chart-bubble', category: 'marketing' },
  { class: 'i-tabler-chart-arcs', category: 'marketing' },
  { class: 'i-tabler-chart-area', category: 'marketing' },
  { class: 'i-tabler-chart-funnel', category: 'marketing' },
  { class: 'i-tabler-report-analytics', category: 'marketing' },
  { class: 'i-tabler-report-money', category: 'marketing' },

  // SPECIALIZED WORKFLOW & AUTOMATION
  { class: 'i-tabler-antenna', category: 'marketing' },
  { class: 'i-tabler-arrows-split', category: 'marketing' },
  { class: 'i-tabler-rotate-clockwise', category: 'marketing' },
  { class: 'i-tabler-broadcast', category: 'marketing' },
  { class: 'i-tabler-switch-horizontal', category: 'marketing' },

  // NICHE INTERFACE ELEMENTS
  { class: 'i-tabler-browser-check', category: 'interface' },
  { class: 'i-tabler-browser-plus', category: 'interface' },
  { class: 'i-tabler-browser-x', category: 'interface' },
  { class: 'i-tabler-viewport-narrow', category: 'interface' },
  { class: 'i-tabler-viewport-wide', category: 'interface' },
  { class: 'i-tabler-separator', category: 'interface' },
  { class: 'i-tabler-spacing-vertical', category: 'interface' },

  // SPECIALIZED CONTENT
  { class: 'i-tabler-sitemap', category: 'content' },
  { class: 'i-tabler-notebook', category: 'content' },
  { class: 'i-tabler-text-recognition', category: 'content' },
  { class: 'i-tabler-spellcheck', category: 'content' },
  { class: 'i-tabler-crown', category: 'content' },
  { class: 'i-tabler-device-tv', category: 'content' },

  // ADVANCED MEDIA
  { class: 'i-tabler-photo-plus', category: 'media' },
  { class: 'i-tabler-photo-star', category: 'media' },
  { class: 'i-tabler-photo-heart', category: 'media' },
  { class: 'i-tabler-photo-check', category: 'media' },
  { class: 'i-tabler-slideshow', category: 'media' },
  { class: 'i-tabler-album', category: 'media' },
  { class: 'i-tabler-playlist', category: 'media' },
  { class: 'i-tabler-headphones', category: 'media' },
  { class: 'i-tabler-music', category: 'media' },

  // SPECIALIZED COMMERCE
  { class: 'i-tabler-currency-euro', category: 'commerce' },
  { class: 'i-tabler-tags', category: 'commerce' },
  { class: 'i-tabler-barcode', category: 'commerce' },
  { class: 'i-tabler-qrcode', category: 'commerce' },
  { class: 'i-tabler-box', category: 'commerce' },
  { class: 'i-tabler-coin', category: 'commerce' },
  { class: 'i-tabler-wallet', category: 'commerce' },
  { class: 'i-tabler-cash', category: 'commerce' },

  // VERY SPECIALIZED FEATURES
  { class: 'i-tabler-ai', category: 'interface' },
  { class: 'i-tabler-robot', category: 'interface' },
  { class: 'i-tabler-brain', category: 'interface' },
  { class: 'i-tabler-wand', category: 'interface' },
  { class: 'i-tabler-accessible', category: 'interface' },
  { class: 'i-tabler-contrast-2', category: 'interface' },

  // NICHE WORKFLOW ELEMENTS
  { class: 'i-tabler-timeline', category: 'marketing' },
  { class: 'i-tabler-hierarchy', category: 'marketing' },
  { class: 'i-tabler-stack', category: 'marketing' },
  { class: 'i-tabler-stairs', category: 'marketing' },
  { class: 'i-tabler-calendar-stats', category: 'marketing' },
  { class: 'i-tabler-calendar-time', category: 'marketing' },
  { class: 'i-tabler-calendar-event', category: 'marketing' },

  // EXTENDED FUNCTIONALITY
  { class: 'i-tabler-news', category: 'interface' },
  { class: 'i-tabler-plane', category: 'interface' },
  { class: 'i-tabler-plane-arrival', category: 'interface' },
  { class: 'i-tabler-plane-departure', category: 'interface' },
  { class: 'i-tabler-planet', category: 'interface' },
  { class: 'i-tabler-school', category: 'interface' },
  { class: 'i-tabler-building', category: 'interface' },
  { class: 'i-tabler-building-skyscraper', category: 'interface' },

  // RARE BUT USEFUL
  { class: 'i-tabler-atom', category: 'interface' },
  { class: 'i-tabler-award', category: 'interface' },
  { class: 'i-tabler-asterisk', category: 'interface' },
  { class: 'i-tabler-north-star', category: 'interface' },
  { class: 'i-tabler-box-multiple', category: 'interface' },
  { class: 'i-tabler-section-sign', category: 'interface' },
  { class: 'i-tabler-stack-2', category: 'interface' },

  // VERY SPECIALIZED
  { class: 'i-tabler-play', category: 'media' },
  { class: 'i-tabler-pause', category: 'media' },
  { class: 'i-tabler-stop', category: 'media' },
  { class: 'i-tabler-flip-horizontal', category: 'media' },
  { class: 'i-tabler-flip-vertical', category: 'media' },
  { class: 'i-tabler-photo-hexagon', category: 'media' },
  { class: 'i-tabler-photo-off', category: 'media' },
  { class: 'i-tabler-photo-video', category: 'media' },
  { class: 'i-tabler-panorama-horizontal', category: 'media' },
  { class: 'i-tabler-panorama-vertical', category: 'media' },
  { class: 'i-tabler-camera-selfie', category: 'media' },
  { class: 'i-tabler-camera-plus', category: 'media' },

  // EXTENDED COMMUNICATION
  { class: 'i-tabler-message-circle', category: 'social' },
  { class: 'i-tabler-message-dots', category: 'social' },
  { class: 'i-tabler-message-plus', category: 'social' },
  { class: 'i-tabler-message-report', category: 'social' },
  { class: 'i-tabler-messages-off', category: 'social' },
  { class: 'i-tabler-phone-call', category: 'social' },
  { class: 'i-tabler-phone-incoming', category: 'social' },
  { class: 'i-tabler-phone-outgoing', category: 'social' },
  { class: 'i-tabler-phone-plus', category: 'social' },
  { class: 'i-tabler-phone-check', category: 'social' },
  { class: 'i-tabler-user-minus', category: 'social' },
  { class: 'i-tabler-user-x', category: 'social' },
  { class: 'i-tabler-users-plus', category: 'social' },
  { class: 'i-tabler-users-group', category: 'social' },

  // EXTENDED COMMERCE
  { class: 'i-tabler-basket', category: 'commerce' },
  { class: 'i-tabler-cash-banknote', category: 'commerce' },
  { class: 'i-tabler-receipt-refund', category: 'commerce' },
  { class: 'i-tabler-receipt-tax', category: 'commerce' },
  { class: 'i-tabler-truck-return', category: 'commerce' },
  { class: 'i-tabler-scale', category: 'commerce' },
  { class: 'i-tabler-ticket', category: 'commerce' },
  { class: 'i-tabler-badge', category: 'commerce' },
  { class: 'i-tabler-discount-check', category: 'commerce' },

  // ADVANCED MARKETING
  { class: 'i-tabler-target-arrow', category: 'marketing' },
  { class: 'i-tabler-ballpen', category: 'marketing' },
  { class: 'i-tabler-mail-off', category: 'marketing' },
  { class: 'i-tabler-mail-cog', category: 'marketing' },
  { class: 'i-tabler-mail-question', category: 'marketing' },
  { class: 'i-tabler-affiliate', category: 'marketing' },
  { class: 'i-tabler-social', category: 'marketing' },
  { class: 'i-tabler-click', category: 'marketing' },
  { class: 'i-tabler-clock', category: 'marketing' },
  { class: 'i-tabler-map', category: 'marketing' },
  { class: 'i-tabler-cursor-text', category: 'marketing' },
  { class: 'i-tabler-brand-producthunt', category: 'marketing' },
  { class: 'i-tabler-brand-stripe', category: 'marketing' },
  { class: 'i-tabler-badge-3d', category: 'marketing' },
  { class: 'i-tabler-certificate-2', category: 'marketing' },
  { class: 'i-tabler-signature', category: 'marketing' },
  { class: 'i-tabler-podium', category: 'marketing' },
  { class: 'i-tabler-growth', category: 'marketing' },
  { class: 'i-tabler-virus', category: 'marketing' },
  { class: 'i-tabler-flag', category: 'marketing' },
  { class: 'i-tabler-ghost', category: 'marketing' },
  { class: 'i-tabler-plane-arrival', category: 'marketing' },
] as const

// Extract icon name without prefix
type ExtractIconName<T> = T extends `i-tabler-${infer R}` ? R : never

// Create union type of all icon names without the prefix
export type IconName = ExtractIconName<(typeof recommendedIcons)[number]['class']>

export function getIconList() {
  return recommendedIcons.map(icon => icon.class.replace('i-tabler-', '')) as IconName[]
}
