/**
 * Twilio Verify Service for 2FA Authentication
 * Uses Twilio Verify API to send and verify SMS codes
 */

// Twilio credentials from environment variables
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN
const TWILIO_VERIFY_SERVICE_SID = import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID

/**
 * Check if Twilio Verify is properly configured
 */
export function isTwilioConfigured() {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_VERIFY_SERVICE_SID)
}

/**
 * Format phone number to E.164 format
 * @param {string} phoneNumber - Phone number (e.g., 924380050 or +51924380050)
 * @returns {string} - Formatted phone number (e.g., +51924380050)
 */
function formatPhoneNumber(phoneNumber) {
  // Remove all spaces and non-digit characters except +
  let cleaned = phoneNumber.replaceAll(' ', '').replace(/[^\d+]/g, '')
  
  // If doesn't start with +, add Peru country code
  if (!cleaned.startsWith('+')) {
    cleaned = '+51' + cleaned
  }
  
  return cleaned
}

/**
 * Send SMS verification code via Twilio Verify API
 * @param {string} phoneNumber - Phone number (e.g., 924380050)
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function sendVerificationSMS(phoneNumber) {
  const formattedPhone = formatPhoneNumber(phoneNumber)
  
  console.log('📱 Enviando código a:', formattedPhone)
  
  // Check if Twilio is configured
  if (!isTwilioConfigured()) {
    console.warn('⚠️ Twilio no está configurado correctamente')
    return { 
      success: false, 
      error: 'Servicio de SMS no configurado. Contacta al administrador.'
    }
  }
  
  try {
    // Twilio Verify API endpoint
    const url = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`
    
    // Create form data
    const formData = new URLSearchParams()
    formData.append('To', formattedPhone)
    formData.append('Channel', 'sms')
    
    // Make API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    const data = await response.json()
    
    if (response.ok && data.status === 'pending') {
      console.log('✅ Código enviado correctamente. SID:', data.sid)
      return { 
        success: true, 
        message: 'Código enviado a tu teléfono' 
      }
    } else {
      console.error('❌ Error de Twilio Verify:', data)
      
      // Handle specific errors
      if (data.code === 60200) {
        return { success: false, error: 'Número de teléfono inválido' }
      } else if (data.code === 60203) {
        return { success: false, error: 'Demasiados intentos. Espera unos minutos.' }
      } else if (data.code === 60212) {
        return { success: false, error: 'Este número no puede recibir SMS' }
      }
      
      return { 
        success: false, 
        error: data.message || 'Error al enviar el código' 
      }
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error)
    return { 
      success: false, 
      error: 'Error de conexión. Verifica tu internet.' 
    }
  }
}

/**
 * Verify the SMS code entered by the user via Twilio Verify API
 * @param {string} phoneNumber - Phone number (e.g., 924380050)
 * @param {string} code - 6-digit code entered by user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verifyCode(phoneNumber, code) {
  const formattedPhone = formatPhoneNumber(phoneNumber)
  
  console.log('🔐 Verificando código para:', formattedPhone)
  
  if (!isTwilioConfigured()) {
    return { 
      success: false, 
      error: 'Servicio de verificación no configurado' 
    }
  }
  
  try {
    // Twilio Verify Check API endpoint
    const url = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`
    
    // Create form data
    const formData = new URLSearchParams()
    formData.append('To', formattedPhone)
    formData.append('Code', code)
    
    // Make API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    const data = await response.json()
    
    if (response.ok && data.status === 'approved') {
      console.log('✅ Código verificado correctamente')
      return { success: true }
    } else {
      console.error('❌ Verificación fallida:', data)
      
      if (data.status === 'pending') {
        return { success: false, error: 'Código incorrecto. Intenta de nuevo.' }
      } else if (data.code === 60202) {
        return { success: false, error: 'Demasiados intentos fallidos.' }
      } else if (data.code === 20404) {
        return { success: false, error: 'Código expirado. Solicita uno nuevo.' }
      }
      
      return { 
        success: false, 
        error: 'Código incorrecto o expirado' 
      }
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error)
    return { 
      success: false, 
      error: 'Error de conexión. Verifica tu internet.' 
    }
  }
}

export default {
  sendVerificationSMS,
  verifyCode,
  isTwilioConfigured
}
