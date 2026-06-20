# language: es
Característica: Galería de Proyectos
  Como visitante del portfolio
  Quiero ver los proyectos de MitzuStudios
  Para evaluar su trabajo y tecnologías utilizadas

  Antecedentes:
    Dado que existen proyectos publicados en la base de datos
    Y accedo a la sección "Proyectos" de la landing page

  Escenario: Visualización de tarjetas de proyecto
    Dado que hay proyectos creados
    Entonces cada tarjeta de proyecto muestra un título
    Y cada tarjeta de proyecto muestra una descripción corta
    Y cada tarjeta de proyecto muestra una imagen desde Cloudinary (si existe, o placeholder)
    Y cada tarjeta de proyecto muestra las tecnologías con iconos
    Y si la tecnología tiene enlace GitHub, se muestra como enlace clicable

  Escenario: Los proyectos se ordenan por fecha de creación descendente
    Dado que existen proyectos con distintas fechas de creación
    Entonces el proyecto más reciente aparece primero en la galería
    Y el proyecto más antiguo aparece al final

  Escenario: Galería vacía cuando no hay proyectos publicados
    Dado que no hay proyectos en la base de datos
    Entonces la sección "Proyectos" muestra un mensaje indicando que no hay proyectos aún
    Y no se renderizan tarjetas de proyecto

  Escenario: Galería solo muestra proyectos publicados
    Dado que existen proyectos con estado "publicado", "oculto" y "borrador"
    Cuando veo la sección "Proyectos" de la landing page
    Entonces solo veo las tarjetas de los proyectos con estado "publicado"
    Y no veo los proyectos en estado "oculto" ni "borrador"
