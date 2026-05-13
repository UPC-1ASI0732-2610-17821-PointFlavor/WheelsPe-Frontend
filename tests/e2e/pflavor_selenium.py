from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException
from datetime import datetime, timedelta
import time

URL = "https://pflavor-frontend.vercel.app/"
EMAIL = "andreow@123.com"
PASSWORD = "123123123"

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 15)
short_wait = WebDriverWait(driver, 4)


def pause(t=2):
    time.sleep(t)


def safe_click(element):
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)


def set_native_date(input_el, value):
    driver.execute_script(
        "arguments[0].focus();"
        "const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;"
        "setter.call(arguments[0], arguments[1]);"
        "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));"
        "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));"
        "arguments[0].blur();",
        input_el,
        value,
    )


def try_day(start_input, year, month, day):
    """Intenta poner la fecha y devuelve el valor real que quedó seteado."""
    value = f"{year:04d}-{month:02d}-{day:02d}"
    set_native_date(start_input, value)
    time.sleep(0.6)
    return start_input.get_attribute("value")


def main():
    print("[LOG] Abriendo:", URL)
    driver.get(URL)
    pause()

    # ---------- LOGIN ----------
    print("[LOG] Esperando formulario de login...")
    email_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#email")))
    password_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#password")))

    email_input.clear()
    email_input.send_keys(EMAIL)
    print(f"[LOG] Email ingresado: {EMAIL}")

    password_input.clear()
    password_input.send_keys(PASSWORD)
    print("[LOG] Contraseña ingresada")
    pause(1)

    submit_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
    safe_click(submit_btn)
    print("[LOG] Click en botón de inicio de sesión")
    pause(3)

    # Verificar inicio de sesión: si dejó de aparecer el form de login asumimos éxito
    try:
        short_wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "input#password")))
        print("[OK] INICIO DE SESION EXITOSO")
    except TimeoutException:
        print("[ERROR] No se pudo iniciar sesión")
        return

    pause(2)

    # ---------- SELECCIONAR PRIMER VEHÍCULO ----------
    print("[LOG] Buscando primer vehículo...")
    first_vehicle = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "div.vehicle-info"))
    )
    name = first_vehicle.find_element(By.CSS_SELECTOR, ".vehicle-name").text
    print(f"[LOG] Seleccionando vehículo: {name}")
    safe_click(first_vehicle)
    pause(2)

    # ---------- FECHA DE INICIO ----------
    print("[LOG] Buscando selector de fecha de inicio...")
    start_input = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "div.date-selector input.date-input"))
    )

    today = datetime.today()
    year, month = today.year, today.month
    candidates = [16, 18, 20]
    chosen_day = None
    chosen_value = None

    for d in candidates:
        # si el día ya pasó este mes, probamos el mes siguiente
        base = today.replace(day=1)
        try:
            tentative = base.replace(day=d)
        except ValueError:
            continue
        if tentative.date() < today.date():
            # mover al mes siguiente
            if month == 12:
                tentative = datetime(year + 1, 1, d)
            else:
                tentative = datetime(year, month + 1, d)

        print(f"[LOG] Probando día {d} -> {tentative.strftime('%Y-%m-%d')}")
        result = try_day(start_input, tentative.year, tentative.month, tentative.day)
        if result == tentative.strftime("%Y-%m-%d"):
            chosen_day = d
            chosen_value = result
            print(f"[OK] Fecha de inicio aceptada: {chosen_value} (día {chosen_day})")
            break
        else:
            print(f"[WARN] Día {d} no disponible, probando siguiente...")

    if not chosen_value:
        print("[ERROR] No se pudo seleccionar ninguna fecha (16, 18, 20)")
        return

    pause(1)

    # ---------- FECHA DE FIN (día siguiente) ----------
    end_inputs = driver.find_elements(By.CSS_SELECTOR, "div.date-selector input.date-input")
    if len(end_inputs) >= 2:
        end_input = end_inputs[1]
        start_dt = datetime.strptime(chosen_value, "%Y-%m-%d")
        end_dt = start_dt + timedelta(days=1)
        end_value = end_dt.strftime("%Y-%m-%d")
        # quitar disabled si lo tiene
        driver.execute_script("arguments[0].removeAttribute('disabled');", end_input)
        set_native_date(end_input, end_value)
        print(f"[LOG] Fecha de fin: {end_value}")
        pause(1)

    # ---------- CONTINUAR AL PAGO ----------
    print("[LOG] Click en 'Continuar al pago'")
    continuar = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class,'btn-primary') and contains(., 'Continuar al pago')]"))
    )
    safe_click(continuar)
    pause(2)

    # ---------- MÉTODO DE PAGO: EFECTIVO ----------
    print("[LOG] Seleccionando método de pago: Efectivo")
    efectivo_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class,'method-btn')]//span[normalize-space()='Efectivo']/.."))
    )
    safe_click(efectivo_btn)
    pause(1)

    # ---------- CONFIRMAR PAGO ----------
    print("[LOG] Click en 'Confirmar Pago'")
    confirmar = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class,'btn-confirm')]"))
    )
    safe_click(confirmar)
    pause(2)

    # ---------- CHECKBOX TÉRMINOS ----------
    print("[LOG] Aceptando términos (checkbox)")
    try:
        terms = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input#terms")))
        safe_click(terms)
        pause(1)
        # segundo clic / confirmación según flujo
        terms2 = driver.find_elements(By.CSS_SELECTOR, "input#terms")
        if terms2:
            safe_click(terms2[-1])
            print("[LOG] Segundo click en términos")
    except TimeoutException:
        print("[WARN] No se encontró checkbox de términos")

    pause(3)
    print("[OK] Flujo completado")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[ERROR] Excepción: {e}")
    finally:
        time.sleep(5)
        driver.quit()
