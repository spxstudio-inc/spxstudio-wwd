import { useEffect, useRef } from "react";

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

export default function LivePreview({ html, css, js }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updatePreview();
  }, [html, css, js]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const document = iframeRef.current.contentDocument;
    if (!document) return;

    document.open();
    document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            // Error handling wrapper
            try {
              ${js}
            } catch (error) {
              console.error('Script error:', error);
              
              // Create error display
              const errorElement = document.createElement('div');
              errorElement.style.position = 'fixed';
              errorElement.style.bottom = '0';
              errorElement.style.left = '0';
              errorElement.style.right = '0';
              errorElement.style.background = '#f56565';
              errorElement.style.color = 'white';
              errorElement.style.padding = '10px';
              errorElement.style.fontFamily = 'monospace';
              errorElement.style.zIndex = '9999';
              errorElement.textContent = 'JavaScript Error: ' + error.message;
              document.body.appendChild(errorElement);
            }
          </script>
        </body>
      </html>
    `);
    document.close();
  };

  return (
    <iframe
      ref={iframeRef}
      title="Website Preview"
      className="w-full h-full border-0"
      sandbox="allow-scripts"
    />
  );
}
