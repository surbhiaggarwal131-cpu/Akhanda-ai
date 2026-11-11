AKHANDA AI — MOBILE PWA PREVIEW
================================

This preview has the app files directly in the extracted folder (index.html
is at the top level). It is a responsive interface preview only; AI responses
are intentionally not connected and no API key is collected.

RUN ON WINDOWS
--------------
1. Extract the ZIP to a normal folder, for example Desktop\AkhandaPreview.
2. Open that extracted folder. You must see index.html, styles.css and app.js.
3. Double-click "Run Akhanda Preview.bat".
4. Your browser should open http://127.0.0.1:8000/.
5. Keep the black Command Prompt window open while using the preview.

MANUAL START (ALTERNATIVE)
--------------------------
Open Command Prompt in the extracted folder (the folder containing index.html)
and run:

    python -m http.server 8000 --bind 127.0.0.1

Then visit:

    http://127.0.0.1:8000/

If the browser displays a directory listing, you started the server in the
wrong folder. Stop it with Ctrl+C, open the folder that visibly contains
index.html, start the command again, and visit the URL above.

PUBLISH SO OTHER PEOPLE CAN OPEN IT
----------------------------------
Upload the contents of this folder (not the ZIP itself) to a static web host
that serves the site over HTTPS. A public HTTPS address is needed for reliable
PWA installation and service-worker support. Do not upload API keys or secrets.

INSTALL
-------
Android: Open the HTTPS site in Chrome, then choose Install app / Add to Home
screen from the browser menu (wording varies by version).
iPhone/iPad: Open the HTTPS site in Safari, tap Share, then Add to Home Screen.
Desktop: Use the install icon in a supported browser when it appears.

IMPORTANT
---------
This version only establishes the responsive, installable interface. AI
responses are intentionally disabled until a suitable provider and its terms
are reviewed for the intended audience. Do not add a Gemini key to this preview.
