# language: es
Característica: Gestión de Solicitudes de Contacto
  Como administrador de MitzuStudios
  Quiero gestionar las solicitudes de contacto recibidas
  Para dar seguimiento y responder a potenciales clientes

  Antecedentes:
    Dado que estoy autenticado en el panel admin
    Y existen solicitudes de contacto en la base de datos

  Escenario: Visualizar listado de solicitudes
    Dado que accedo a la sección de solicitudes del panel
    Entonces veo un listado con todas las solicitudes recibidas
    Y cada solicitud muestra: nombre, email, teléfono, tipo de proyecto y fecha
    Y veo el estado (leída/no leída) de cada solicitud

  Escenario: Marcar solicitud como leída/no leída
    Dado que estoy viendo el listado de solicitudes
    Cuando marco una solicitud como "leída"
    Entonces la solicitud cambia su estado a leída
    Cuando marco una solicitud como "no leída"
    Entonces la solicitud cambia su estado a no leída

  Escenario: Responder a una solicitud desde el panel (canal por defecto)
    Dado que estoy viendo una solicitud de contacto
    Cuando escribo una respuesta
    Y selecciono un canal de envío (WhatsApp o Email)
    Entonces el sistema envía la respuesta al solicitante por el canal seleccionado
    Y la respuesta queda registrada en la base de datos
    Y la solicitud se marca como "respondida"

  Escenario: Filtrar solicitudes por estado
    Dado que hay solicitudes leídas y no leídas
    Cuando selecciono el filtro "No leídas"
    Entonces solo veo las solicitudes con estado "no leída"
    Cuando selecciono el filtro "Leídas"
    Entonces solo veo las solicitudes con estado "leída"
    Cuando selecciono "Todas"
    Entonces veo todas las solicitudes sin filtro

  Escenario: Admin responde solicitud vía WhatsApp
    Dado que estoy viendo una solicitud de contacto
    Cuando escribo una respuesta
    Y selecciono el canal "WhatsApp" para enviarla
    Entonces el sistema envía la respuesta al número de teléfono del solicitante vía WhatsApp
    Y la respuesta queda registrada en la base de datos asociada a la solicitud
    Y la solicitud se marca como "respondida"

  Escenario: Admin responde solicitud vía Email
    Dado que estoy viendo una solicitud de contacto
    Cuando escribo una respuesta
    Y selecciono el canal "Email" para enviarla
    Entonces el sistema envía la respuesta al email del solicitante vía Resend
    Y la respuesta queda registrada en la base de datos asociada a la solicitud
    Y la solicitud se marca como "respondida"

  Escenario: Nueva solicitud dispara notificación WhatsApp a PYME
    Dado que un cliente envía el formulario de contacto con datos válidos
    Cuando la solicitud se guarda en la base de datos
    Entonces el sistema envía automáticamente un WhatsApp al número configurado de la PYME
    Y el mensaje incluye: nombre, email, teléfono, tipo de proyecto y descripción del cliente
