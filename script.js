document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8090/api';
    let currentWeek = '1';
    
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

            // Get correct time slot and day index
            const row = slot.parentElement;
            const timeSlot = row.querySelector('.time-label').textContent.trim();
            const dayIndex = Array.from(row.children).indexOf(slot) - 1;

            const reservationData = {
                name,
                phone,
                week,
                timeSlot,
                dayIndex
            };

            const saved = await saveReservation(reservationData);
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
            console.log('Sending data:', data); // Debug log

            const response = await fetch(`${API_URL}/save_reservation.php`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Unknown error');
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al guardar la reserva: ${error.message}`);
            return false;
        }
    }

    // Load reservations for current week
    async function loadWeekReservations(week) {
        try {
            const response = await fetch(`${API_URL}/get_reservations.php?week=${week}`);
            const result = await response.json();
            
            if (result.success) {
                // Clear all reservations first
                document.querySelectorAll('.time-slot.reserved').forEach(slot => {
                    slot.classList.remove('reserved');
                    slot.innerHTML = '';
                });

                // Apply reservations for current week
                result.data.forEach(reservation => {
                    // Find the specific time-label that matches the reservation time
                    const timeLabels = Array.from(document.querySelectorAll('.time-label'));
                    const timeRowIndex = timeLabels.findIndex(label => 
                        label.textContent.trim() === reservation.timeSlot.trim()
                    );

                    if (timeRowIndex !== -1) {
                        // Get the parent row containing the time slots
                        const row = timeLabels[timeRowIndex].parentElement;
                        // Get the specific slot using dayIndex
                        const slot = row.children[parseInt(reservation.dayIndex) + 1];
                        
                        if (slot && slot.classList.contains('time-slot')) {
                            applyReservation(slot, reservation.name, reservation.phone);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    }

    // Add week change handler
    document.getElementById('weekSelect').addEventListener('change', function(e) {
        currentWeek = e.target.value;
        loadWeekReservations(currentWeek);
    });

    // Initialize
    createModal();
    loadWeekReservations(currentWeek);
    
    // Add click handlers to available slots
    document.querySelectorAll('.available').forEach(slot => {
        slot.onclick = () => showModal(slot);
    });
});