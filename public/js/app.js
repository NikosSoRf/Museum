document.addEventListener('DOMContentLoaded', function() {
    const API_URL = '/exhibits/api';
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            if (!confirm('Вы уверены, что хотите удалить этот экспонат?')) return;
            
            try {
                const response = await fetch(`${API_URL}/${this.dataset.id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Ошибка удаления');
                
                window.location.reload();
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось удалить экспонат');
            }
        });
    });
    
    const loadBtn = document.getElementById('loadExhibits');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
});