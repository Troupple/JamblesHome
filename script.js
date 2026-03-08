document.addEventListener('DOMContentLoaded', () => {
  fetch('JamblesFun.svg')
    .then(res => res.text())
    .then(svg => {
      document.querySelector('.logo-container').innerHTML = svg;
    });

  const projects = [
    { title: 'Adachi Jisho', icon: 'Projects/Adachi-Jisho.png', link: 'https://troupple.github.io/Adachi-Jisho.github.io/' },
    { title: 'Know Frills', icon: 'Projects/Know-Frills.png', link: '#' },
    { title: 'Tools4Teaching', icon: 'Projects/Tools4Teaching.png', link: 'https://tools4teaching.online/' }
  ];

  const posts = document.querySelector('.posts');
  projects.forEach(project => {
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = project.link;
    a.innerHTML = `
      <img src="${project.icon}" alt="${project.title}" class="page-link-img">
    `;
    posts.appendChild(a);
  });
  const footerImg = document.getElementById('footer-frame-img');
  if (footerImg) {
    let toggled = false;
    footerImg.addEventListener('click', () => {
      toggled = !toggled;
      footerImg.src = toggled ? 'frame2.png' : 'frame1.png';
    });
  }
});
