import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'

import en from '@/locales/en.json'

vi.mock('@/app/iam/application/user.store.js', () => ({
  login: vi.fn()
}))

import { login } from '@/app/iam/application/user.store.js'

const routes = [
  { path: '/', component: { template: '<div />' } },
  { path: '/auth/login', component: { template: '<div />' } },
  { path: '/auth/register/select-role', component: { template: '<div />' } },
  { path: '/rental/browse', component: { template: '<div />' } }
]

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

async function mountLogin() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  await router.push('/auth/login')
  await router.isReady()

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en }
  })

  const LoginPage = (await import('@/app/iam/views/login-page.vue')).default

  const wrapper = mount(LoginPage, {
    global: {
      plugins: [router, i18n]
    }
  })

  return { wrapper, router }
}

describe('Login page', () => {
  beforeEach(() => {
    login.mockReset()
  })

  it('shows validation errors for invalid input', async () => {
    const { wrapper } = await mountLogin()

    await wrapper.find('#email').setValue('invalid')
    await wrapper.find('#password').setValue('123')
    await wrapper.find('form').trigger('submit')

    await nextTick()

    const errors = wrapper.findAll('.form__error').map(node => node.text())

    expect(errors).toContain('Please enter a valid email')
    expect(errors).toContain('Password must be at least 6 characters')
    expect(login).not.toHaveBeenCalled()
  })

  it('submits and redirects on success', async () => {
    login.mockResolvedValue({ role: 'renter' })

    const { wrapper, router } = await mountLogin()
    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.find('#email').setValue('TEST@EMAIL.COM')
    await wrapper.find('#password').setValue('123456')
    await wrapper.find('form').trigger('submit')

    await flushPromises()
    await nextTick()

    expect(login).toHaveBeenCalledWith('test@email.com', '123456')
    expect(pushSpy).toHaveBeenCalledWith('/rental/browse')
  })
})
