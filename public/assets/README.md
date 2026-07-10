# Assets folder

Drop your center logo here as:

    public/assets/logo.png

Recommended: a square PNG, transparent background, at least 300×300px —
this is what gets embedded in the middle of every generated QR code.

The app references it at the path `/assets/logo.png`. If you rename the
file, update `CENTER_LOGO_PATH` in `components/QRCodeStyled.tsx` to match.
