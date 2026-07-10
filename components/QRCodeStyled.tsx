'use client';

import { useEffect, useRef, useState } from 'react';

const CENTER_LOGO_PATH = '/assets/logo.png';

type Props = {
  /** The full URL encoded into the QR — e.g. https://qr.whimsiverse.art/c/aurora-01 */
  url: string;
  /** Used to name the exported file, e.g. "aurora-01" */
  fileName: string;
  size?: number;
};

// Renders a styled QR (rounded dots, rounded corner squares, center logo)
// matching the reference look, and lets you export it as a clean SVG for
// print. Built on qr-code-styling, loaded dynamically since it touches
// the canvas/DOM and can't run during server-side rendering.
export default function QRCodeStyled({ url, fileName, size = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { default: QRCodeStyling } = await import('qr-code-styling');

      const qr = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: url,
        image: CENTER_LOGO_PATH,
        margin: 8,
        qrOptions: {
          errorCorrectionLevel: 'H', // higher tolerance, needed since a logo covers the center
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
          imageSize: 0.4,
        },
        dotsOptions: {
          type: 'rounded',
          color: '#5a2d8f',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#3d1f6e',
        },
        cornersDotOptions: {
          type: 'dot',
          color: '#e8820a',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
      });

      if (cancelled || !ref.current) return;
      ref.current.innerHTML = '';
      qr.append(ref.current);
      qrRef.current = qr;
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [url, size]);

  const handleExportSVG = () => {
    qrRef.current?.download({ name: fileName, extension: 'svg' });
  };

  const handleExportPNG = () => {
    qrRef.current?.download({ name: fileName, extension: 'png' });
  };

  return (
    <div className="stack" style={{ alignItems: 'flex-start' }}>
      <div className="qr-preview-wrap" ref={ref} />
      <div className="row">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleExportSVG}
          disabled={!ready}
        >
          Export SVG
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleExportPNG}
          disabled={!ready}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}
