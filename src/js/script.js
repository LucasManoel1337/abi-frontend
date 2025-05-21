document.addEventListener('DOMContentLoaded', () => {
  // Fade in na carga da página
  document.body.classList.add('fade-in');

  // Transição de páginas com fade out
  document.querySelectorAll('.switch a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');

      // Anima fade out no body
      document.body.classList.remove('fade-in');
      document.body.classList.add('fade-out');

      // Após animação, redireciona
      setTimeout(() => {
        window.location.href = href;
      }, 500); // tempo da animação
    });
  });
});
