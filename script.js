document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8090/api';
    
    function createModal() {
        const modalHtml = `
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="reservation-modal" id="reservationModal">
                <h3>Datos de Reserva</h3>
                <input type="text" id="reservationName" placeholder="Nombre completo" required>
                <input type="tel" id="reservationPhone" placeholder="Teléfono de contacto" required>
                <button id="confirmReservation">Confirmar Reserva</button>
                <button id="cancelReservation">Cancelar</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function showModal(slot) {
        const modal = document.getElementById('reservationModal');
        const overlay = document.getElementById('modalOverlay');
        const confirmBtn = document.getElementById('confirmReservation');
        const cancelBtn = document.getElementById('cancelReservation');

        modal.style.display = 'block';
        overlay.style.display = 'block';

        confirmBtn.onclick = async () => {
            const name = document.getElementById('reservationName').value.trim();
            const phone = document.getElementById('reservationPhone').value.trim();
            const week = document.getElementById('weekSelect').value;

            if (!name || !phone) {
                alert('Por favor complete todos los campos');
                return;
            }

            const saved = await saveReservation({ name, phone, week });
            if (saved) {
                applyReservation(slot, name, phone);
                modal.style.display = 'none';
                overlay.style.display = 'none';
            }
        };

        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };
    }

    function applyReservation(slot, name, phone) {
        slot.classList.add('reserved');
        slot.innerHTML = `
            <div class="reserved-info">
                <strong>${name}</strong><br>
                ${phone}
            </div>
        `;
    }

    async function saveReservation(data) {
        try {
            const response = await fetch(`${API_URL}/save_reservation.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la reserva');
            return false;
        }
    }

    // Initialize
    createModal();
    
    // Add click handlers to available slots
    document.querySelectorAll('.available').forEach(slot => {
        slot.onclick = () => showModal(slot);
    });
});