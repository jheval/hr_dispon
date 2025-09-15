document.addEventListener('DOMContentLoaded', function () {
    // Estructura para almacenar las reservas
    let reservations = JSON.parse(localStorage.getItem('classReservations')) || {};

    const weekSelect = document.getElementById('weekSelect');
    const availableSlots = document.querySelectorAll('.available');

    // Función para generar ID único para cada slot
    function getSlotId(weekNumber, dayIndex, timeIndex) {
        return `week${weekNumber}_day${dayIndex}_time${timeIndex}`;
    }

    // Función para aplicar el estilo de reservado
    function applyReservationStyle(slot) {
        slot.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        slot.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.7)';
        slot.innerHTML = '✓';
        slot.style.color = 'white';
        slot.style.fontWeight = 'bold';
        slot.style.fontSize = '20px';
        slot.style.display = 'flex';
        slot.style.justifyContent = 'center';
        slot.style.alignItems = 'center';
        slot.style.cursor = 'default';
        slot.classList.add('reserved');
    }

    // Función para actualizar la vista según la semana seleccionada
    function updateWeekView(weekNumber) {
        availableSlots.forEach(slot => {
            const dayIndex = Array.from(slot.parentNode.children).indexOf(slot) - 1;
            const timeIndex = Array.from(slot.parentNode.parentNode.children).indexOf(slot.parentNode) - 1;
            const slotId = getSlotId(weekNumber, dayIndex, timeIndex);

            // Resetear el slot
            slot.removeAttribute('style');
            slot.innerHTML = '';
            slot.classList.remove('reserved');
            slot.onclick = null;

            // Si está reservado, aplicar estilo
            if (reservations[slotId]) {
                applyReservationStyle(slot);
            } else {
                // Si no está reservado, agregar evento click
                slot.onclick = handleSlotClick;
            }
        });
    }

    // Manejador de click para los slots
    function handleSlotClick(event) {
        const slot = event.target;
        const weekNumber = weekSelect.value;
        const dayIndex = Array.from(slot.parentNode.children).indexOf(slot) - 1;
        const timeIndex = Array.from(slot.parentNode.parentNode.children).indexOf(slot.parentNode) - 1;
        const slotId = getSlotId(weekNumber, dayIndex, timeIndex);

        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const timeLabels = Array.from(document.querySelectorAll('.time-label')).map(el => el.textContent);

        const message = `¿Reservar clase el ${days[dayIndex]} en el horario de ${timeLabels[timeIndex]}?`;

        if (confirm(message)) {
            // Guardar la reserva
            reservations[slotId] = {
                week: weekNumber,
                day: dayIndex,
                time: timeIndex,
                timestamp: new Date().toISOString()
            };
            
            // Guardar en localStorage
            localStorage.setItem('classReservations', JSON.stringify(reservations));
            
            // Aplicar estilo de reservado
            applyReservationStyle(slot);
            
            // Mostrar mensaje de éxito
            setTimeout(() => {
                alert('¡Clase reservada con éxito! Te esperamos en la clase virtual.');
            }, 300);
        }
    }

    // Asignar eventos iniciales
    availableSlots.forEach(slot => {
        slot.onclick = handleSlotClick;
    });

    // Evento para cambio de semana
    weekSelect.addEventListener('change', function() {
        updateWeekView(this.value);
    });

    // Cargar vista inicial
    updateWeekView(weekSelect.value);

    // Soporte para navegación por teclado
    document.addEventListener('keydown', function(e) {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('available') && !focusedElement.classList.contains('reserved')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });
});