import webdriver from 'selenium-webdriver'

const { Builder, By, until } = webdriver

const sauceUser = process.env.SAUCE_USERNAME
const sauceKey = process.env.SAUCE_ACCESS_KEY
const sauceRegion = process.env.SAUCE_REGION || 'us-west-1'
const sauceHost =
  process.env.SAUCE_URL ||
  `https://${sauceUser}:${sauceKey}@ondemand.${sauceRegion}.saucelabs.com/wd/hub`

if (!sauceUser || !sauceKey) {
  console.error('Falta SAUCE_USERNAME o SAUCE_ACCESS_KEY en el entorno.')
  process.exit(1)
}

const sauceOptions = {
  name: process.env.SAUCE_TEST_NAME || 'SauceDemo - checkout E2E',
  build: process.env.SAUCE_BUILD || `local-${new Date().toISOString().slice(0, 10)}`,
  tags: ['e2e', 'saucedemo', 'checkout']
}

const capabilities = {
  browserName: process.env.SAUCE_BROWSER || 'chrome',
  browserVersion: process.env.SAUCE_BROWSER_VERSION || 'latest',
  platformName: process.env.SAUCE_PLATFORM || 'Windows 11',
  'sauce:options': sauceOptions
}

const log = (msg) => console.log(`[saucedemo] ${msg}`)

let driver
let passed = false

try {
  log('Iniciando sesión remota en Sauce Labs...')
  driver = await new Builder()
    .usingServer(sauceHost)
    .withCapabilities(capabilities)
    .build()

  const session = await driver.getSession()
  log(`Sesión: https://app.saucelabs.com/tests/${session.getId()}`)

  await driver.manage().setTimeouts({ implicit: 0, pageLoad: 60000, script: 30000 })
  await driver.manage().window().maximize()

  log('Abriendo https://www.saucedemo.com')
  await driver.get('https://www.saucedemo.com')

  await driver.wait(until.elementLocated(By.id('login-button')), 15000)
  await driver.findElement(By.id('user-name')).sendKeys('standard_user')
  await driver.findElement(By.id('password')).sendKeys('secret_sauce')
  await driver.findElement(By.id('login-button')).click()

  await driver.wait(until.urlContains('inventory'), 15000)
  log('Login OK')

  await driver
    .wait(until.elementLocated(By.id('add-to-cart-sauce-labs-backpack')), 10000)
    .click()
  log('Producto agregado al carrito')

  const cartLink = await driver.wait(
    until.elementLocated(By.css('a.shopping_cart_link')),
    10000
  )
  await driver.wait(until.elementIsVisible(cartLink), 5000)
  await driver.executeScript('arguments[0].click();', cartLink)
  await driver.wait(until.urlContains('cart.html'), 15000)
  log('Carrito abierto')

  const checkoutBtn = await driver.wait(until.elementLocated(By.id('checkout')), 15000)
  await driver.wait(until.elementIsVisible(checkoutBtn), 5000)
  await driver.executeScript('arguments[0].click();', checkoutBtn)
  await driver.wait(until.urlContains('checkout-step-one'), 15000)

  await driver.wait(until.elementLocated(By.id('first-name')), 10000)
  const currentUrl = await driver.getCurrentUrl()
  log(`URL antes de form: ${currentUrl}`)

  const setNativeValue = `
    const [id, val] = arguments;
    const el = document.getElementById(id);
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  `
  await driver.executeScript(setNativeValue, 'first-name', 'Lennin')
  await driver.executeScript(setNativeValue, 'last-name', 'Cenas')
  await driver.executeScript(setNativeValue, 'postal-code', '15001')

  const fn = await driver.findElement(By.id('first-name')).getAttribute('value')
  const ln = await driver.findElement(By.id('last-name')).getAttribute('value')
  const pc = await driver.findElement(By.id('postal-code')).getAttribute('value')
  log(`Form: ${fn} | ${ln} | ${pc}`)

  const continueBtn = await driver.findElement(By.id('continue'))
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', continueBtn)
  await driver.executeScript('arguments[0].click();', continueBtn)
  await driver.wait(until.urlContains('checkout-step-two'), 15000)

  const finishBtn = await driver.wait(until.elementLocated(By.id('finish')), 10000)
  await driver.executeScript('arguments[0].click();', finishBtn)

  const header = await driver
    .wait(until.elementLocated(By.className('complete-header')), 10000)
    .getText()

  if (header.trim() !== 'Thank you for your order!') {
    throw new Error(`Mensaje inesperado: "${header}"`)
  }

  log('TEST EXITOSO — compra finalizada')
  passed = true
} catch (error) {
  console.error('[saucedemo] TEST FALLIDO:', error.message)
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
