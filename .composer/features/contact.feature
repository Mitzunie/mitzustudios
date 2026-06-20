# language: es
Característica: Formulario de Contacto
  Como visitante del portfolio
  Quiero enviar una solicitud de contacto a MitzuStudios
  Para consultar sobre servicios de desarrollo web

  Antecedentes:
    Dado que estoy en la sección "Contacto" de la landing page
    Y veo el formulario de contacto

  Escenario: Envío exitoso del formulario de contacto
    Dado que el formulario tiene los campos: Nombre, Email, Teléfono, Tipo de Proyecto (select) y Descripción
    Cuando completo todos los campos con datos válidos
    Y selecciono un tipo de proyecto del desplegable
    Y envío el formulario
    Entonces veo un mensaje de éxito confirmando el envío
    Y veo un mensaje indicando que recibiré una cotización por WhatsApp o email
    Y la solicitud se guarda en la base de datos
    Y se envía una notificación por email al destinatario configurado
    Y se envía un WhatsApp al número PYME configurado con los datos de la solicitud

  Escenario: Campos inválidos en formulario de contacto
    Dado que el formulario de contacto está visible
    Cuando envío el formulario con campos vacíos o datos inválidos
    Entonces veo mensajes de error específicos para cada campo inválido
    Y el formulario no se envía al servidor
    Y no se guarda ninguna solicitud en la base de datos

  Escenario: Fallo del servicio de email al enviar notificación
    Dado que el servicio Resend no está disponible
    Cuando completo y envío el formulario con datos válidos
    Entonces la solicitud se guarda en la base de datos correctamente
    Y veo un mensaje de éxito en el formulario
    Pero el email de notificación no se entrega (fallo silencioso)

  Escenario: Rate limit excedido en formulario de contacto
    Dado que he enviado el formulario más veces del límite permitido en un período corto
    Cuando intento enviar el formulario nuevamente
    Entonces recibo una respuesta HTTP 429 (Too Many Requests)
    Y veo un mensaje indicando que espere antes de intentar de nuevo

  Escenario: Cliente selecciona "Otro" en tipo de proyecto y escribe descripción
    Dado que estoy en el formulario de contacto
    Cuando selecciono "Otro" en el campo "Tipo de Proyecto"
    Entonces aparece un campo de texto adicional para describir el tipo de proyecto
    Cuando escribo una descripción personalizada "Sistema de reservas para restaurante"
    Y completo el resto de campos con datos válidos
    Y envío el formulario
    Entonces la solicitud se guarda con el tipo de proyecto personalizado

  Escenario: Al enviar solicitud se notifica que será contactado por WhatsApp
    Dado que completo el formulario de contacto con datos válidos
    Cuando envío la solicitud exitosamente
    Entonces veo un mensaje en pantalla que dice "Recibirás una cotización por WhatsApp o email en los próximos días."
    Y la solicitud se guarda en la base de datos

  Escenario: Fallo del servicio de WhatsApp al enviar notificación
    Dado que el servicio de WhatsApp no está disponible
    Cuando completo y envío el formulario con datos válidos
    Entonces la solicitud se guarda en la base de datos correctamente
    Y veo un mensaje de éxito en el formulario
    Y el error de WhatsApp se registra en logs
    Y la solicitud sigue siendo accesible desde el panel admin
