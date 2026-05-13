import webdriver from 'selenium-webdriver'

const { Builder, By, until } = webdriver

const sauceUser = process.env.SAUCE_USERNAME
const sauceKey = process.env.SAUCE_ACCESS_KEY
const sauceRegion = process.env.SAUCE_REGION || 'us-west-1'
const sauceHost = process.env.SAUCE_URL || `https://${sauceUser}:${sauceKey}@ondemand.${sauceRegion}.saucelabs.com/wd/hub`

const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:4173'
const loginPath = '/auth/login'

if (!sauceUser || !sauceKey) {
  console.error('Missing SAUCE_USERNAME or SAUCE_ACCESS_KEY.')
  process.exit(1)
}

const sauceOptions = {
  name: process.env.SAUCE_TEST_NAME || 'MOVEO - login smoke',
  build: process.env.SAUCE_BUILD || 'local',
  tags: ['smoke']
}

if (process.env.SAUCE_TUNNEL_ID) {
  sauceOptions.tunnelIdentifier = process.env.SAUCE_TUNNEL_ID
}

const capabilities = {
  browserName: process.env.SAUCE_BROWSER || 'chrome',
  browserVersion: process.env.SAUCE_BROWSER_VERSION || 'latest',
  platformName: process.env.SAUCE_PLATFORM || 'Windows 11',
  'sauce:options': sauceOptions
}

let driver
let passed = false

try {
  driver = await new Builder()
    .usingServer(sauceHost)
    .withCapabilities(capabilities)
    .build()

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 60000,
    script: 30000
  })

  const targetUrl = `${baseUrl.replace(/\/$/, '')}${loginPath}`
  await driver.get(targetUrl)

  await driver.wait(until.elementLocated(By.css('#email')), 15000)
  await driver.wait(until.elementLocated(By.css('#password')), 15000)
  await driver.wait(until.elementLocated(By.css('.form__submit')), 15000)

  const titleEl = await driver.findElement(By.css('.login-form__title'))
  const titleText = await titleEl.getText()
  if (!titleText || !titleText.trim()) {
    throw new Error('Login title is empty.')
  }

  passed = true
} catch (error) {
  console.error('Sauce test failed:', error)
  process.exitCode = 1
} finally {
  if (driver) {
    try {
      await driver.executeScript(`sauce:job-result=${passed ? 'passed' : 'failed'}`)
    } catch {
      // no-op
    }

    await driver.quit()
  }
}
