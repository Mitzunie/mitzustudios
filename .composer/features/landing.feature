# language: es
Característica: Landing Page
  Como visitante del portfolio
  Quiero ver la landing page completa
  Para conocer a MitzuStudios, sus servicios y proyectos

  Antecedentes:
    Dado que soy un visitante anónimo
    Y accedo a la URL raíz del sitio "/"

  Escenario: La landing page carga con las 5 secciones principales
    Dado que accedo a la landing page
    Entonces veo la sección "Hero" con un título principal y un call-to-action
    Y veo la sección "Sobre Mí" con información del desarrollador
    Y veo la sección "Servicios" con al menos "desarrollo web" listado
    Y veo la sección "Proyectos" con tarjetas de proyecto
    Y veo la sección "Contacto" con el formulario de contacto

  Escenario: Las secciones tienen animaciones sutiles al hacer scroll
    Dado que estoy en la landing page
    Cuando hago scroll hacia abajo
    Entonces los elementos aparecen con animación de fade-in
    Y los elementos tienen efectos hover al pasar el ratón

  Escenario: Google Analytics se carga en producción
    Dado que el sitio está en entorno de producción
    Cuando accedo a cualquier página
    Entonces el script de Google Analytics se carga en el head
    Y los eventos de página se rastrean automáticamente

  Escenario: Fallo de conexión a base de datos
    Dado que la base de datos no está disponible
    Cuando accedo a la landing page
    Entonces veo una página de error amigable
    Y no veo trazas internas del sistema

  Esquema del escenario: Responsive en distintos viewports
    Dado que accedo a la landing page con un viewport de <tamaño>
    Entonces no hay desbordamiento horizontal
    Y todo el contenido es visible y funcional

    Ejemplos:
      | tamaño   |
      | 320px    |
      | 768px    |
      | 1440px   |
      | 2560px   |
