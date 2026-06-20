# language: es
Característica: CRUD de Proyectos
  Como administrador de MitzuStudios
  Quiero crear, editar y eliminar proyectos
  Para mantener actualizada la galería del portfolio

  Antecedentes:
    Dado que estoy autenticado en el panel admin
    Y accedo a la sección de proyectos

  Escenario: Crear un proyecto nuevo completo
    Dado que estoy en el formulario de nuevo proyecto
    Cuando completo título, descripción, imagen, tecnologías y estado "publicado"
    Y guardo el proyecto
    Entonces el proyecto se crea en la base de datos
    Y aparece en el listado de proyectos del panel
    Y aparece en la galería pública de la landing page

  Escenario: Editar un proyecto existente
    Dado que existe un proyecto creado
    Cuando modifico su título, descripción o tecnologías
    Y guardo los cambios
    Entonces los cambios se reflejan en la base de datos
    Y la galería pública muestra la versión actualizada

  Escenario: Eliminar un proyecto existente
    Dado que existe un proyecto creado
    Cuando elimino el proyecto
    Entonces el proyecto se borra de la base de datos
    Y desaparece del listado del panel
    Y desaparece de la galería pública

  Escenario: Subir imagen a Cloudinary desde el panel
    Dado que estoy creando o editando un proyecto
    Cuando selecciono una imagen desde mi computadora
    Y la subo al servidor
    Entonces la imagen se almacena en Cloudinary
    Y la URL de Cloudinary se asocia al proyecto

  Escenario: Fallo al subir imagen a Cloudinary
    Dado que estoy creando un proyecto
    Cuando intento subir una imagen y Cloudinary no responde
    Entonces veo un mensaje de error "Error al subir la imagen"
    Y puedo reintentar la subida
    Y el proyecto se puede guardar igualmente sin imagen (opcional)
    Y puedo añadir la imagen después editando el proyecto

  Escenario: Visualizar listado de proyectos ordenados por fecha
    Dado que existen proyectos creados en distintas fechas
    Cuando veo el listado de proyectos en el panel
    Entonces los proyectos aparecen ordenados por fecha de creación descendente
    Y el proyecto más reciente está al inicio

  Escenario: Concurrencia al editar proyectos
    Dado que dos administradores están editando el mismo proyecto
    Cuando ambos guardan los cambios
    Entonces el último guardado prevalece sin corrupción de datos

  Escenario: Proyecto se crea como borrador
    Dado que estoy en el formulario de nuevo proyecto
    Cuando completo título, descripción y tecnologías
    Y guardo el proyecto sin publicar
    Entonces el proyecto se crea con estado "borrador"
    Y aparece en el listado de proyectos del panel
    Pero NO aparece en la galería pública de la landing page

  Escenario: Proyecto se publica/oculta desde el panel
    Dado que existe un proyecto con estado "borrador"
    Cuando cambio su estado a "publicado" desde el panel
    Entonces el proyecto aparece en la galería pública de la landing page
    Cuando cambio su estado a "oculto"
    Entonces el proyecto desaparece de la galería pública
    Y el proyecto sigue visible en el panel admin

  Escenario: Crear proyecto sin imagen
    Dado que estoy en el formulario de nuevo proyecto
    Cuando completo título, descripción y tecnologías
    Y NO selecciono ninguna imagen
    Y guardo el proyecto
    Entonces el proyecto se crea correctamente en la base de datos
    Y en la galería pública se muestra sin imagen (placeholder o layout alternativo)
    Y puedo añadir una imagen después editando el proyecto

  Escenario: Filtrar proyectos por estado en el panel
    Dado que existen proyectos con estados publicado, oculto y borrador
    Cuando selecciono el filtro "Publicados" en el panel
    Entonces solo veo los proyectos con estado "publicado"
    Cuando selecciono el filtro "Borradores"
    Entonces solo veo los proyectos con estado "borrador"
    Cuando selecciono "Todos"
    Entonces veo todos los proyectos sin filtro
