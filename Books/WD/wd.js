document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      window.open(link, '_self');
    });
});