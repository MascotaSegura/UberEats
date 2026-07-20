# Manifiesto de Diseño (UI/UX)

Al trabajar en este proyecto, siempre debes adherirte a las siguientes reglas de diseño y estilo visual:

- **Diseño Limpio, Profesional y Plano:** Queda estrictamente prohibido usar sombras (`box-shadow`), degradados (`gradients`) o efectos que añadan volumen falso. Todo debe ser "flat design".
- **Esquinas Redondeadas Permitidas y Recomendadas:** Usa bordes redondeados consistentes. Por ejemplo, `rounded-2xl` para las tarjetas de productos/modales y `rounded-full` (forma de píldora) para botones de acción principales, menús y barras de búsqueda.
- **Sin Líneas Innecesarias:** No uses líneas separadoras rectas o cuadrículas rígidas si no son vitales. Usa el espaciado (margins, paddings, gaps) y el contraste de colores de fondo para separar los elementos visuales.
- **Contraste Moderno (Fondo vs Tarjeta):** Usa un fondo general ligeramente oscuro o grisáceo (por ejemplo, `#F3F4F6`) para la página, y ubica los componentes interactivos dentro de tarjetas de fondo completamente blanco (`bg-white`) con bordes redondeados.
- **Funcionalidad Concreta:** Ningún elemento debe estar de adorno si no cumple una función concreta para el usuario. Nada de elementos rotos o con inconsistencias entre pantallas.

---
## Autonomía de Agentes y Evolución de Reglas

Cualquier IA que trabaje en este proyecto tiene la autoridad explícita para proponer y agregar de manera autónoma nuevas reglas a este archivo (`AGENTS.md`), siempre y cuando se cumplan estrictamente los siguientes criterios:

1. **Certeza Absoluta:** El agente debe estar 100% seguro de que la regla es correcta, necesaria y refleja un patrón o solución técnica definitiva (no meras sugerencias, experimentos o suposiciones dudosas).
2. **Justificación Sólida:** La nueva regla debe resolver un problema recurrente o establecer un estándar arquitectónico/UX claro que mejore el proyecto a largo plazo.
3. **Consistencia Estricta:** La nueva directriz jamás debe contradecir, debilitar ni crear ambigüedad con ninguna de las convenciones ya existentes en este manifiesto (especialmente las reglas inquebrantables como el "flat design").
4. **Reporte Obligatorio:** Cada vez que un agente agregue una nueva regla bajo este criterio, debe informar explícitamente al usuario en su respuesta de chat: qué regla exacta se agregó al archivo y cuál es la justificación técnica detrás de esa decisión.

**Advertencia Crítica a Agentes:** Este es un archivo delicado y maestro que rige el comportamiento estructural y visual de todo el proyecto. Ejerce esta autonomía con extremo cuidado y rigor analítico para evitar el abuso, las contradicciones o la inflación innecesaria de directrices.
