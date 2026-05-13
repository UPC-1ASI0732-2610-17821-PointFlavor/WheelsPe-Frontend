# moveo-frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## E2E (Selenium + Sauce Labs)

This project includes a simple Sauce Labs Selenium smoke test that validates the login page.

### Requirements

- Sauce Labs credentials: `SAUCE_USERNAME`, `SAUCE_ACCESS_KEY`
- Public base URL for the frontend: `E2E_BASE_URL`
  - Example: `https://your-frontend-domain.com`
  - If you want to test a local server, use Sauce Connect and set `SAUCE_TUNNEL_ID`.

### Run the test

PowerShell:

```powershell
$env:SAUCE_USERNAME="your-username"
$env:SAUCE_ACCESS_KEY="your-access-key"
$env:E2E_BASE_URL="https://your-frontend-domain.com"
npm run test:sauce
```

Optional settings:

- `SAUCE_REGION` (default: `us-west-1`)
- `SAUCE_PLATFORM` (default: `Windows 11`)
- `SAUCE_BROWSER` (default: `chrome`)
- `SAUCE_BROWSER_VERSION` (default: `latest`)
- `SAUCE_BUILD`, `SAUCE_TEST_NAME`
- `SAUCE_TUNNEL_ID` (when using Sauce Connect)
