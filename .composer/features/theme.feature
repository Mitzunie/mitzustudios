# language: es
Característica: Modo Oscuro / Claro
  Como visitante del portfolio
  Quiero cambiar entre modo oscuro y claro
  Para elegir la apariencia visual que prefiero

  Antecedentes:
    Dado que estoy en la landing page
    Y veo un toggle de tema visible

  Escenario: Cambiar entre modo oscuro y claro
    Dado que el tema actual es modo oscuro
    Cuando hago clic en el toggle de tema
    Entonces el sitio cambia a modo claro
    Y todos los componentes actualizan sus colores al tema claro
    Cuando hago clic nuevamente en el toggle
    Entonces el sitio vuelve a modo oscuro

  Escenario: Modo oscuro es el tema por defecto
    Dado que soy un visitante nuevo sin preferencia guardada
    Cuando accedo al sitio por primera vez
    Entonces el tema aplicado es modo oscuro

  Escenario: Preferencias de tema persisten al recargar
    Dado que he cambiado al modo claro
    Cuando recargo la página
    Entonces el sitio sigue mostrándose en modo claro
