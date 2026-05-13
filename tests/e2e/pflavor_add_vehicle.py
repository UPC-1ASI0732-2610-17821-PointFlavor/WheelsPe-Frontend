from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException
import random
import string
import time

URL = "https://pflavor-frontend.vercel.app/"
EMAIL = "esther@123.com"
PASSWORD = "123123123"

BRANDS = ["Toyota", "Kia", "Hyundai", "Honda", "BMW"]
MODELS_BY_BRAND = {
    "Toyota": ["Corolla", "Yaris", "Rav4"],
    "Kia": ["Rio", "Sportage", "Picanto"],
    "Hyundai": ["Accent", "Tucson", "Elantra"],
    "Honda": ["Civic", "Fit", "CR-V"],
    "BMW": ["Serie 3", "X1", "Serie 5"],
}

chrome_opts = Options()
chrome_opts.add_argument("--disable-features=PasswordLeakDetection,PasswordManagerOnboarding,AutofillServerCommunication,PasswordCheck")
chrome_opts.add_argument("--disable-save-password-bubble")
chrome_opts.add_argument("--guest")
chrome_opts.add_experimental_option("prefs", {
    "credentials_enable_service": False,
    "profile.password_manager_enabled": False,
    "profile.password_manager_leak_detection": False,
    "autofill.profile_enabled": False,
})
chrome_opts.add_experimental_option("excludeSwitches", ["enable-automation"])
driver = webdriver.Chrome(options=chrome_opts)
wait = WebDriverWait(driver, 15)
short_wait = WebDriverWait(driver, 4)


def pause(t=1.5):
    time.sleep(t)


def safe_click(element):
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)


def open_select(aria_label):
    """Abre un PrimeVue p-select buscando por aria-label."""
    el = wait.until(EC.element_to_be_clickable((
        By.XPATH,
        f"//span[contains(@class,'p-select-label') and @aria-label=\"{aria_label}\"]"
    )))
    safe_click(el)
    pause(0.6)


def pick_option_random(list_id, exclude_first_placeholder=False, prefer_label=None):
    """Selecciona una opción aleatoria (o por etiqueta exacta) del listbox abierto."""
    options = wait.until(EC.presence_of_all_elements_located((
        By.CSS_SELECTOR, f"ul#{list_id} li.p-select-option, li.p-select-option[id^='{list_id.replace('_list','')}_']"
    )))
    options = [o for o in options if o.is_displayed()]
    if not options:
        # fallback: cualquier li visible de cualquier list abierta
        options = driver.find_elements(By.CSS_SELECTOR, "li.p-select-option")
        options = [o for o in options if o.is_displayed()]

    if prefer_label:
        for o in options:
            if o.text.strip().lower() == prefer_label.lower():
                safe_click(o)
                return o.text.strip()

    if exclude_first_placeholder and len(options) > 1:
        options = options[1:]

    choice = random.choice(options)
    label = choice.text.strip()
    safe_click(choice)
    return label


def login():
    print("[LOG] Abriendo:", URL)
    driver.get(URL)
    pause(2)

    email_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#email")))
    password_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#password")))
    email_input.clear(); email_input.send_keys(EMAIL)
    password_input.clear(); password_input.send_keys(PASSWORD)
    print(f"[LOG] Login con {EMAIL}")

    submit_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
    safe_click(submit_btn)

    try:
        short_wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "input#password")))
        print("[OK] INICIO DE SESION EXITOSO")
    except TimeoutException:
        print("[ERROR] No se pudo iniciar sesion")
        raise

    # Cerrar popup nativo de Chrome ("Cambia tu contraseña") si aparece
    try:
        from selenium.webdriver.common.action_chains import ActionChains
        ActionChains(driver).send_keys(Keys.ESCAPE).perform()
        time.sleep(0.4)
        ActionChains(driver).send_keys(Keys.ESCAPE).perform()
    except Exception:
        pass


def add_vehicle():
    print("[LOG] Click en 'Agregar Vehículo'")
    add_btn = wait.until(EC.element_to_be_clickable((
        By.XPATH, "//button[contains(@class,'btn-add')]"
    )))
    safe_click(add_btn)
    pause(3)

    # Marca - retry por si el modal está animándose
    brand = random.choice(BRANDS)
    print(f"[LOG] Marca: {brand}")
    last_err = None
    for _ in range(5):
        try:
            brand_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input#brand")))
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", brand_input)
            brand_input.click()
            brand_input.send_keys(Keys.CONTROL, "a")
            brand_input.send_keys(Keys.DELETE)
            brand_input.send_keys(brand)
            break
        except Exception as e:
            last_err = e
            time.sleep(0.8)
    else:
        raise last_err

    # Modelo
    model = random.choice(MODELS_BY_BRAND[brand])
    print(f"[LOG] Modelo: {model}")
    for _ in range(5):
        try:
            model_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input#model")))
            model_input.click()
            model_input.send_keys(Keys.CONTROL, "a")
            model_input.send_keys(Keys.DELETE)
            model_input.send_keys(model)
            break
        except Exception:
            time.sleep(0.8)

    # Año (rango válido 1990-2025) - el default es 2026 que está fuera de rango
    year_value = random.randint(2015, 2024)
    print(f"[LOG] Año: {year_value}")
    try:
        year_input = driver.find_element(By.CSS_SELECTOR, "#year input.p-inputnumber-input")
        year_input.click()
        year_input.send_keys(Keys.CONTROL, "a")
        year_input.send_keys(Keys.DELETE)
        year_input.send_keys(str(year_value))
        year_input.send_keys(Keys.TAB)
    except Exception as e:
        print(f"[WARN] No se pudo setear año: {e}")
    pause(0.4)
    pause(0.4)

    # Color (siempre uno aleatorio)
    print("[LOG] Abriendo selector de color")
    open_select("Selecciona un color")
    color = pick_option_random("color_list")
    print(f"[LOG] Color elegido: {color}")
    pause(0.4)

    # Transmisión
    print("[LOG] Abriendo selector de transmisión")
    open_select("Selecciona transmisión")
    transmission = pick_option_random("transmission_list")
    print(f"[LOG] Transmisión: {transmission}")
    pause(0.4)

    # Combustible
    print("[LOG] Abriendo selector de combustible")
    open_select("Selecciona combustible")
    fuel = pick_option_random("fuelType_list")
    print(f"[LOG] Combustible: {fuel}")
    pause(0.4)

    # Placa: 3 letras + 3 dígitos
    letters = "".join(random.choices(string.ascii_uppercase, k=3))
    digits = "".join(random.choices(string.digits, k=3))
    plate = f"{letters}-{digits}"
    print(f"[LOG] Placa: {plate}")
    plate_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#licensePlate")))
    plate_input.clear(); plate_input.send_keys(plate)
    pause(0.4)

    # Distrito
    print("[LOG] Abriendo selector de distrito")
    open_select("Selecciona un distrito")
    district = pick_option_random("district_list")
    print(f"[LOG] Distrito: {district}")
    pause(0.4)

    # Dirección (opcional)
    streets = ["Av. Primavera", "Av. Arequipa", "Av. Brasil", "Av. Javier Prado", "Jr. Lampa", "Av. La Marina"]
    address = f"{random.choice(streets)} {random.randint(100, 1999)}"
    print(f"[LOG] Dirección: {address}")
    try:
        address_input = driver.find_element(By.CSS_SELECTOR, "input#address")
        address_input.clear(); address_input.send_keys(address)
    except Exception:
        print("[WARN] No se encontró input de dirección")

    # Precio aleatorio 100-250
    price = random.randint(100, 250)
    print(f"[LOG] Precio/día: {price}")
    try:
        # PrimeVue InputNumber suele tener input dentro de #price o nombre price
        price_input = None
        for sel in ["input#price", "input[id='price']", "input[name='pricePerDay']", "input[id*='price']"]:
            els = driver.find_elements(By.CSS_SELECTOR, sel)
            if els:
                price_input = els[0]
                break
        if price_input is None:
            # fallback: cualquier input numérico
            price_input = driver.find_element(By.XPATH, "//label[contains(translate(., 'PRECIO', 'precio'),'precio')]/following::input[1]")
        price_input.click()
        price_input.send_keys(Keys.CONTROL, "a")
        price_input.send_keys(Keys.DELETE)
        price_input.send_keys(str(price))
    except Exception as e:
        print(f"[WARN] No se pudo setear precio: {e}")

    pause(0.6)

    # Activo: asegurar que el switch/checkbox esté activado
    try:
        toggles = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox'], .p-toggleswitch, .p-inputswitch")
        for t in toggles:
            cls = t.get_attribute("class") or ""
            checked = t.get_attribute("aria-checked") or t.get_attribute("checked")
            if "toggleswitch" in cls or "inputswitch" in cls:
                if checked != "true":
                    safe_click(t)
                    print("[LOG] Toggle 'Activo' encendido")
                    break
    except Exception:
        pass

    pause(0.5)

    # Verificar que no haya campos con error antes de publicar
    invalids = driver.find_elements(By.CSS_SELECTOR, ".p-invalid")
    if invalids:
        print(f"[WARN] Hay {len(invalids)} campos inválidos antes de publicar:")
        for el in invalids:
            try:
                eid = el.get_attribute("id") or el.get_attribute("aria-label") or "?"
                print(f"   - invalid: {eid}")
            except Exception:
                pass

    # Publicar (botón submit específico)
    print("[LOG] Click en 'Publicar Vehículo'")
    publish_btn = wait.until(EC.element_to_be_clickable((
        By.CSS_SELECTOR, "button.btn-submit[type='submit']"
    )))
    safe_click(publish_btn)
    pause(4)

    # Verificar resultado: si seguimos en /add-vehicle es porque falló validación
    current_url = driver.current_url
    print(f"[LOG] URL tras publicar: {current_url}")
    post_invalids = driver.find_elements(By.CSS_SELECTOR, ".p-invalid")
    if post_invalids and "add" in current_url.lower():
        print(f"[ERROR] La publicación falló - {len(post_invalids)} campos inválidos quedaron")
        for el in post_invalids:
            try:
                eid = el.get_attribute("id") or el.get_attribute("aria-label") or "?"
                print(f"   - {eid}")
            except Exception:
                pass
    else:
        print(f"[OK] Vehículo publicado: {brand} {model} {year_value} | {color} | {transmission} | {fuel} | {plate} | {district} | S/.{price}/día")


def main():
    login()
    pause(2)
    add_vehicle()
    pause(3)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[ERROR] Excepción: {e}")
    finally:
        time.sleep(5)
        driver.quit()
