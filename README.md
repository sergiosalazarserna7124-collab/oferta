# Oferta Lead Master — tablero horizontal

Sitio estático. El contenido se mueve **en horizontal** (tipo Miro):
rueda del mouse, flechas del teclado, arrastrar con el mouse o los chips de arriba.

## Rutas
- `/` — oferta general de Lead Master, armada sobre los **dolores del cliente** (no sobre Go High Level).
- `/ghl/` — la oferta anterior, basada en los 3 pasos (Go High Level, control comercial, capacitación). No se indexa.
- `/raul/` — propuesta para Raúl: ¿un gerente por proyecto? (costo de gerentes vs. el sistema)

## La oferta (`/`), panel por panel
0. **Inicio** — «Tienes leads. Lo que te falta es control.» Caritas (cansado, aburrido, perdido, frustrado) y notas con frases reales de prospectos.
1. **Hoy** — «Tienes un CRM o un Excel…»: un CRM que se llena de leads sin actualizar y 6 dolores, cada uno con la frase de un prospecto.
2. **Mientras tanto** — la carrera: mientras tú repartes el lead a mano (Excel, decidir asesor, el asesor lo ve tarde), otra inmobiliaria le contesta en 2 minutos y se queda con la venta. Sello «Venta perdida».
3. **Lo que pierdes** — calculadora: leads al mes y de cada 10 a cuántos se les da seguimiento → leads pagados sin trabajar, al año, y ventas que se fueron (supone que compra 1 de cada 50).
4. **Lo hace solo** — las fuentes (Meta, campañas, WhatsApp, portales) entran a Lead Master, y sale lo que hace solo: organiza y reparte, etapa, llena el CRM, recuerda, agenda, reportes. Abajo, el pipeline que se mueve solo.
5. **Tu día** — celular con avisos; botón para verlo como asesor o como dueño con equipo.
6. **Mejores leads** — el ciclo con Meta: Lead Master le devuelve quién agendó y compró, y Meta busca más personas así.
7. **Tus números** — embudo «sin / con Lead Master» y tabla por asesor (contactó, responde en, citas).
8. **El resultado** — antes y después, testimonio y clientes.
9. **Arrancamos** — precio, pasos y preguntas frecuentes (¿es un bot?, ¿mi equipo lo tiene que aprender?).

### Precio (panel 9)
- Normalmente: implementación + capacitación + soporte, **2.000 USD de entrada** (tachado).
- **Solo en noviembre**: sin los 2.000 USD de entrada; **197 USD/mes con 5 asesores conectados**, **+7 USD por asesor adicional**, **gerentes ilimitados**.
- El botón − / + calcula el mensual según los asesores (197 + 7 por cada uno arriba de 5). Las constantes están en `oferta.js` (`BASE`, `INCL`, `EXTRA`).
- **Cuando termine noviembre** hay que cambiar o quitar el sello «Solo en noviembre» y el texto de los 2.000 USD en `index.html`.

### De dónde salen las frases
Las citas entre comillas son textuales de llamadas grabadas en Fathom con prospectos y clientes
(sep–nov 2026), sin nombres. Los números de la tabla, el embudo y el celular son **ejemplos**.
Los clientes de la cinta son los mismos de la prueba social de leadmaster.com.co.

## Archivos
- `index.html` — la oferta
- `oferta.css` — estilos y animaciones propias de la oferta (encima de `styles.css`)
- `oferta.js` — calculadora, asesor/dueño, embudo sin/con y animaciones que arrancan al entrar a cada panel
- `styles.css` — diseño base compartido (crema, terracota, ámbar; modo claro y oscuro)
- `app.js` — navegación horizontal, arrastre, progreso
- `ghl/` — la oferta anterior (reutiliza `styles.css` y `app.js`)
- `raul/` — página, estilos y calculadora de la propuesta para Raúl (reutiliza `styles.css` y `app.js`)
- `render.yaml` — configuración para Render

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
