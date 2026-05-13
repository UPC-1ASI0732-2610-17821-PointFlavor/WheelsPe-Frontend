import webdriver from 'selenium-webdriver'

const { Builder, By, until } = webdriver

const sauceUser = process.env.SAUCE_USERNAME
const sauceKey = process.env.SAUCE_ACCESS_KEY
const sauceRegion = process.env.SAUCE_REGION || 'us-west-1'
const sauceHost =
  process.env.SAUCE_URL ||
  `https://${sauceUser}:${sauceKey}@ondemand.${sauceRegion}.saucelabs.com/wd/hub`

if (!sauceUser || !sauceKey) {
  console.error('Falta SAUCE_USERNAME o SAUCE_ACCESS_KEY.')
  process.exit(1)
}

const targetUrl =
  process.env.E2E_URL ||
  'https://pflavor-frontend-git-main-andreowsp-1757s-projects.vercel.app/auth/login'

const holdSeconds = Number(process.env.HOLD_SECONDS || 180)

const capabilities = {
  browserName: 'chrome',
  browserVersion: 'latest',
  platformName: 'Windows 11',
  'sauce:options': {
    name: process.env.SAUCE_TEST_NAME || 'PFLAVOR - sesión guiada',
    build: process.env.SAUCE_BUILD || `guided-${new Date().toISOString().slice(0, 16)}`,
    tags: ['guided', 'pflavor'],
    idleTimeout: 300
  }
}

const log = (msg) => console.log(`[pflavor] ${msg}`)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let driver
let passed = false

try {
  log('Conectando a Sauce Labs...')
  driver = await new Builder()
    .usingServer(sauceHost)
    .withCapabilities(capabilities)
    .build()

  const session = await driver.getSession()
  const sessionUrl = `https://app.saucelabs.com/tests/${session.getId()}`
  log(`Sesión en vivo: ${sessionUrl}`)

  await driver.manage().setTimeouts({ implicit: 0, pageLoad: 60000, script: 30000 })
  await driver.manage().window().maximize()

  log(`Abriendo ${targetUrl}`)
  await driver.get(targetUrl)

  try {
    await driver.wait(until.elementLocated(By.css('input[type="email"], #email')), 15000)
    log('Página de login cargada — input email visible')
  } catch {
    log('No se encontró el input de email aún; revisa el video.')
  }

  const currentUrl = await driver.getCurrentUrl()
  const title = await driver.getTitle()
  log(`URL actual: ${currentUrl}`)
  log(`Título: ${title}`)

  log(`Manteniendo sesión abierta ${holdSeconds}s para inspección en vivo...`)
  const endAt = Date.now() + holdSeconds * 1000
  while (Date.now() < endAt) {
    await sleep(20000)
    await driver.getTitle()
    const remaining = Math.round((endAt - Date.now()) / 1000)
    log(`...sesión activa, ${remaining}s restantes`)
  }

  passed = true
} catch (error) {
  console.error('[pflavor] Error:', error.message)
  process.exitCode = 1
} finally {
  if (driver) {
    try {
      await driver.executeScript(`sauce:job-result=${passed ? 'passed' : 'failed'}`)
    } catch {
      // ignore
    }
    await driver.quit()
  }
}
