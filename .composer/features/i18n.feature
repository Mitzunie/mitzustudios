# language: es
Característica: Internacionalización (i18n)
  Como visitante del portfolio
  Quiero cambiar el idioma del sitio
  Para ver el contenido en español o inglés

  Antecedentes:
    Dado que estoy en la landing page
    Y veo un toggle de idioma visible

  Escenario: Cambiar idioma entre español e inglés
    Dado que el idioma actual es español
    Cuando hago clic en el toggle de idioma para cambiar a inglés
    Entonces todo el contenido visible cambia a inglés
    Y los textos de navegación, secciones y formularios están en inglés
    Cuando hago clic nuevamente para cambiar a español
    Entonces todo el contenido vuelve a español

  Escenario: Idioma por defecto es español
    Dado que soy un visitante nuevo sin preferencia guardada
    Cuando accedo al sitio por primera vez
    Entonces el contenido se muestra en español

  Escenario: Preferencia de idioma persiste al recargar
    Dado que he cambiado el idioma a inglés
    Cuando recargo la página
    Entonces el contenido sigue mostrándose en inglés
