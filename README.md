# Oferta Lead Master — tablero horizontal

Sitio estático de una sola página. El contenido se mueve **en horizontal** (tipo Miro):
rueda del mouse, flechas del teclado, arrastrar con el mouse o los chips de arriba.

## Rutas
- `/` — oferta general de Lead Master
- `/raul/` — propuesta para Raúl: ¿un gerente por proyecto? (costo de gerentes vs. el sistema)

## Archivos
- `index.html` — todo el contenido de la oferta
- `styles.css` — diseño cálido (crema, terracota, ámbar)
- `app.js` — navegación horizontal, arrastre, progreso
- `render.yaml` — configuración para Render
- `raul/` — página, estilos y calculadora de la propuesta para Raúl (reutiliza `styles.css` y `app.js`)

## Ver en local
```
python3 -m http.server 8000
```
Luego abrir http://localhost:8000

## Publicar en Render (Static Site)
1. Subir esta carpeta a un repo de GitHub.
2. En Render: **New → Static Site** → conectar el repo.
3. Build Command: *(vacío)* · Publish Directory: `.`
4. Deploy.

Si conectas el repo con `render.yaml` incluido, Render toma esa configuración solo.
