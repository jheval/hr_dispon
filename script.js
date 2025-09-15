// Add interaction to available time slots
document.addEventListener('DOMContentLoaded', function() {
    const availableSlots = document.querySelectorAll('.available');
    
    availableSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Get the day and time information
            const dayIndex = Array.from(this.parentNode.children).indexOf(this) - 1;
            const timeIndex = Array.from(this.parentNode.parentNode.children).indexOf(this.parentNode) - 1;
            
            const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            const timeLabels = Array.from(document.querySelectorAll('.time-label')).map(el => el.textContent);
            
            // Create a confirmation message
            const message = `¿Reservar clase el ${days[dayIndex]} en el horario de ${timeLabels[timeIndex]}?`;
            
            if (confirm(message)) {
                // Visual feedback for reservation
                this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
                this.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.7)';
                
                // Add checkmark icon (using text)
                this.innerHTML = '✓';
                this.style.color = 'white';
                this.style.fontWeight = 'bold';
                this.style.fontSize = '20px';
                this.style.display = 'flex';
                this.style.justifyContent = 'center';
                this.style.alignItems = 'center';
                
                // Disable further clicks
                this.style.cursor = 'default';
                this.onclick = null;
                
                // Show success message
                setTimeout(() => {
                    alert('¡Clase reservada con éxito! Te esperamos en la clase virtual.');
                }, 300);
            }
        });
    });
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('available')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });
});