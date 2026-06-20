# language: es
Característica: Autenticación del Panel Admin
  Como administrador de MitzuStudios
  Quiero iniciar y cerrar sesión en el panel admin
  Para gestionar el contenido de forma segura

  Antecedentes:
    Dado que existen 3 usuarios administradores autorizados en la base de datos

  Escenario: Login con credenciales correctas
    Dado que estoy en la página "/admin/login"
    Cuando ingreso un email y contraseña válidos de un administrador autorizado
    Entonces el sistema me autentica correctamente
    Y me redirige al dashboard del panel admin

  Escenario: Login con credenciales incorrectas
    Dado que estoy en la página "/admin/login"
    Cuando ingreso un email o contraseña incorrectos
    Entonces veo un mensaje de error "Credenciales inválidas"
    Y no se crea ninguna sesión

  Escenario: Login de usuario no autorizado
    Dado que existe un usuario con email válido pero que no está en la lista de 3 autorizados
    Cuando intenta iniciar sesión
    Entonces veo un mensaje de error indicando que no tiene acceso
    Y no se crea ninguna sesión

  Escenario: Logout del panel admin
    Dado que estoy autenticado en el panel admin
    Cuando hago clic en "Cerrar sesión"
    Entonces la sesión se destruye
    Y soy redirigido a la página de login

  Escenario: Sesión persiste al recargar página
    Dado que estoy autenticado en el panel admin
    Cuando recargo la página del panel
    Entonces sigo autenticado y veo el contenido del panel

  Escenario: Acceso no autenticado al panel admin
    Dado que NO estoy autenticado
    Cuando intento acceder a una ruta "/admin/*"
    Entonces soy redirigido a "/admin/login" con código 302

  Escenario: Rate limit en login excedido
    Dado que he intentado iniciar sesión múltiples veces con credenciales incorrectas
    Cuando supero el límite de intentos permitidos
    Entonces recibo una respuesta HTTP 429
    Y veo un mensaje indicando que espere antes de intentar de nuevo
