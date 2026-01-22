import type React from "react"
import type { Metadata } from "next"
import { Roboto, Lora, Montserrat } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"] })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"], variable: "--font-montserrat" })

export const metadata: Metadata = {
  title: "Mike D'Arezzo - Cyber Wins Podcast",
  description:
    "Expert insights from Mike D'Arezzo on cybersecurity, PCI compliance, and information security strategies",
  icons: {
    icon: "/icon.svg",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="rb2b-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(key) {
                if (window.reb2b) return;
                window.reb2b = {loaded: true};
                var s = document.createElement("script");
                s.async = true;
                s.src = "https://b2bjsstore.s3.us-west-2.amazonaws.com/b/" + key + "/" + key + ".js.gz";
                document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
              }("1N5W0HMJ7005");
            `,
          }}
        />
        {/* Load Roboto Font as a fallback for environments that don't use next/font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Lora:wght@400;500&family=Montserrat:wght@600&display=swap"
          rel="stylesheet"
        />
        {/* Include n8n Chat Widget Styles */}
        <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
        {/* Brand + Chat Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                /* Cyber Wins brand palette */
                --cyber--primary: #90027D; /* primary purple (official brand color) */
                --cyber--secondary: #C23BD4; /* secondary bright purple (accents) */
                --cyber--surface: #FEFEFE; /* neutral surface (page background) */
                --cyber--dark: #1A1A2E; /* dark navy for contrast */
                --cyber--text: #1A1A2E; /* headings & body text (contrast) */

                /* Chat-specific colors (mapped from Cyber Wins palette) */
                --chat--color-primary: var(--cyber--primary);
                --chat--color-secondary: var(--cyber--secondary);
                --chat--color-heading: var(--cyber--text);

                /* Typography */
                --chat--font-family: 'Lora', serif;
                --chat--heading-font-family: 'Montserrat', sans-serif;
                --chat--spacing: 1.25rem;
                --chat--border-radius: 12px;
                --chat--message--font-size: 1rem;
                --chat--message-line-height: 1.6;
                --chat--heading--font-size: 1.5rem;
                --chat--subtitle--font-size: 1rem;

                /* Visuals */
                --chat--header--background: var(--cyber--surface);
                --chat--header--color: var(--chat--color-heading);
                --chat--toggle--background: var(--chat--color-primary);
                --chat--toggle--hover--background: #b003a0; /* slightly lighter than primary */
                --chat--toggle--active--background: var(--cyber--secondary);
                --chat--toggle--color: #ffffff;
                --chat--toggle--size: 56px;

                --chat--message--user--background: var(--cyber--primary); /* stronger contrast for user messages */
                --chat--message--user--color: #ffffff;
                --chat--message--bot--background: #f0e6f5;
                --chat--message--bot--color: var(--chat--color-heading);

                /* Page background & text */
                --page--background: var(--cyber--surface);
                --page--text: var(--cyber--text);
              }

              /* Apply brand font across widget and page fallback */
              html, body, .n8n-chat-widget *, .n8n-chat-widget {
                font-family: var(--chat--font-family) !important;
                font-weight: 400 !important; /* Lora regular for body */
                color: var(--page--text) !important;
              }

              /* Force headings bold */
              .n8n-chat-widget h1,
              .n8n-chat-widget h2,
              .n8n-chat-widget h3,
              .n8n-chat-widget .chat-header__title {
                font-family: var(--chat--heading-font-family) !important;
                font-weight: 600 !important; /* Montserrat bold for titles */
                color: var(--chat--color-heading) !important;
              }

              /* Chat header styling */
              .n8n-chat-widget .chat-header {
                background: var(--chat--header--background) !important;
                color: var(--chat--header--color) !important;
              }

              /* Chat toggle uses brand colors */
              .n8n-chat-widget .chat-toggle {
                background: var(--chat--toggle--background) !important;
                color: var(--chat--toggle--color) !important;
                width: var(--chat--toggle--size) !important;
                height: var(--chat--toggle--size) !important;
              }

              /* Message bubbles */
              .n8n-chat-widget .message--user {
                background: var(--chat--message--user--background) !important;
                color: var(--chat--message--user--color) !important;
              }

              .n8n-chat-widget .message--bot {
                background: var(--chat--message--bot--background) !important;
                color: var(--chat--message--bot--color) !important;
              }

              /* Page-level styles (footer included) */
              body {
                background: var(--page--background);
                color: var(--page--text);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                margin: 0;
              }

              footer.cyber-footer {
                background: transparent;
                color: var(--page--text);
                text-align: center;
                padding: 24px 12px;
                font-size: 0.95rem;
                border-top: 1px solid rgba(26,26,46,0.04);
              }

              footer.cyber-footer .made-with {
                font-weight: 400;
              }

              /* CTA button styling (use .cyber-cta on buttons) */
              .cyber-cta {
                background: var(--cyber--primary);
                color: #ffffff;
                border: none;
                padding: 10px 16px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                font-family: var(--chat--heading-font-family);
              }

              /* Ensure chatbot is visible with high z-index */
              n8n-chat {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 9999 !important;
              }

              /* Ensure the entire widget (when not in shadow DOM) uses left-to-right layout */
              #n8n-chat .n8n-chat-widget,
              .n8n-chat-widget {
                direction: ltr !important;
                unicode-bidi: isolate !important;
              }

              /* Make the input/footer area a flex row and ensure the input grows */
              .n8n-chat-widget .chat-footer,
              .n8n-chat-widget .chat-input,
              .n8n-chat-widget .message-input,
              .n8n-chat-widget .chat-input__row,
              .n8n-chat-widget .chat-input__actions {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
              }

              /* Let the text input stretch and not overflow */
              .n8n-chat-widget textarea,
              .n8n-chat-widget input[type="text"],
              .n8n-chat-widget .chat-input__textarea {
                flex: 1 1 auto !important;
                min-width: 0 !important;
              }

              /* Push action buttons (send) to the far-right */
              .n8n-chat-widget .chat-input__actions,
              .n8n-chat-widget button[type="submit"],
              .n8n-chat-widget button[aria-label="Send"],
              .n8n-chat-widget .send-button {
                margin-left: auto !important;
                order: 2 !important;
              }

              /* Ensure any left-floating icons inside input do not prevent send from being right */
              .n8n-chat-widget .chat-input .left-icon,
              .n8n-chat-widget .chat-input__left {
                order: 0 !important;
                margin-right: 8px !important;
              }

              @media (max-width: 600px) {
                .n8n-chat-widget .chat-toggle {
                  width: 48px !important;
                  height: 48px !important;
                }
              }
            `,
          }}
        />
      </head>
      <body className={`${lora.className} ${montserrat.variable}`}>
        {children}

        {/* Chat Target */}
        <div id="n8n-chat"></div>

        <Script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js').then(({ createChat }) => {
                  createChat({
                    webhookUrl: 'https://automations.manymangoes.com.au/webhook/8306dd20-ac28-40ca-802b-63586e178d6b/chat',
                    containerId: 'n8n-chat',
                    botName: 'Cyber Wins Assistant',
                    target: '#n8n-chat',
                    mode: 'window',
                    showWelcomeScreen: false,
                    loadPreviousSession: false,
                    initialMessages: [
                      'Hi there! 👋',
                      'Welcome to Cyber Wins Podcast! Ask me anything about our conversation with Mike D\\'Arezzo'
                    ],
                    i18n: {
                      en: {
                        title: 'Cyber Wins Assistant 👋',
                        subtitle: 'Ready to Score Your Next Win?',
                        getStarted: 'Start Chat',
                        inputPlaceholder: 'Type your message...',
                      },
                    },
                    theme: {
                      primary: '#90027D',
                      secondary: '#C23BD4',
                      heading: '#1A1A2E',
                      cta: '#90027D'
                    }
                  });

                  const poll = setInterval(() => {
                    try {
                      const host = document.querySelector('n8n-chat');
                      if (!host) return;
                      const shadow = host.shadowRoot;
                      if (!shadow) return;

                      if (!shadow.getElementById('cyber-injected-style')) {
                        const s = document.createElement('style');
                        s.id = 'cyber-injected-style';
                        s.textContent = \`
                          :host { direction: ltr !important; unicode-bidi: isolate !important; }

                          .chat-footer,
                          .chat-input,
                          .message-input,
                          .chat-input__row,
                          .chat-input__actions {
                            display: flex !important;
                            align-items: center !important;
                            gap: 8px !important;
                          }

                          textarea,
                          input[type="text"],
                          .chat-input__textarea {
                            flex: 1 1 auto !important;
                            min-width: 0 !important;
                          }

                          .chat-input__actions,
                          button[type="submit"],
                          button[aria-label="Send"],
                          .send-button {
                            margin-left: auto !important;
                            order: 2 !important;
                          }

                          .chat-input .left-icon,
                          .chat-input__left {
                            order: 0 !important;
                            margin-right: 8px !important;
                          }
                        \`;
                        shadow.appendChild(s);
                      }

                      const powered = shadow.querySelector('.chat-powered-by, .powered-by, .chat-footer__powered');
                      if (powered) powered.remove();

                      host.setAttribute('dir', 'ltr');

                      clearInterval(poll);
                    } catch (e) {
                      console.warn('chat widget customization attempt failed:', e);
                    }
                  }, 200);

                  setTimeout(() => clearInterval(poll), 10000);
                });
              } catch (err) {
                console.error('Failed to load n8n chat widget', err);
              }
            `,
          }}
        />

        <Script id="hubspot-tracking" src="//js.hs-scripts.com/20742828.js" strategy="afterInteractive" />

        <Script
          id="linkedin-insight"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "2413122";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
                if (!l) {
                  window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                  window.lintrk.q=[];
                }
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";
                b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })(window.lintrk);
            `,
          }}
        />
        {/* LinkedIn noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=2413122&fmt=gif"
          />
        </noscript>
      </body>
    </html>
  )
}
