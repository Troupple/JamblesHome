document.addEventListener('DOMContentLoaded', () => {
  // Bear
  const leftPupil = document.getElementById('leftPupil');
  const rightPupil = document.getElementById('rightPupil');
  const leftBrow = document.getElementById('leftBrow');
  const rightBrow = document.getElementById('rightBrow');
  const bearGroup = document.getElementById('bearGroup');
  const bearSvg = document.querySelector('.bear-svg');

  let dizzyUntil = 0;
  let accumulatedRotation = 0;
  let lastAngle = null;

  let prevX = window.innerWidth / 2;
  let prevY = window.innerHeight / 2;
  let prevTime = performance.now();

  let mouseX = prevX;
  let mouseY = prevY;

  let browLiftAmount = 0;
  let timeout;

  function getCenter() {
    const rect = bearSvg.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function animateBear() {
    const now = performance.now();
    const { x: centerX, y: centerY } = getCenter();

    const isDizzy = now < dizzyUntil;

    if (isDizzy) {
      const dizzyAngle = now * 0.0055;

      const dizzyX = Math.cos(dizzyAngle) * 2.4;
      const dizzyY = Math.sin(dizzyAngle) * 2.4;

      leftPupil.setAttribute('cx', 21.74 + dizzyX);
      leftPupil.setAttribute('cy', 25.99 + dizzyY);

      rightPupil.setAttribute('cx', 47.89 + dizzyX);
      rightPupil.setAttribute('cy', 25.99 + dizzyY);

      const wobble = Math.sin(now * 0.015) * 2.2;

      bearGroup.style.transform = `rotate(${wobble}deg)`;
    } else {
      bearGroup.style.transform = 'rotate(0deg)';

      const angle = Math.atan2(
        mouseY - centerY,
        mouseX - centerX
      );

      const moveX = Math.cos(angle) * 1.4;
      const moveY = Math.sin(angle) * 1.4;

      leftPupil.setAttribute('cx', 21.74 + moveX);
      leftPupil.setAttribute('cy', 25.99 + moveY);

      rightPupil.setAttribute('cx', 47.89 + moveX);
      rightPupil.setAttribute('cy', 25.99 + moveY);
    }

    leftBrow.style.transform =
      `translateY(${-browLiftAmount}px)`;

    rightBrow.style.transform =
      `translateY(${-browLiftAmount}px)`;

    requestAnimationFrame(animateBear);
  }

  function startBearAnimation() {
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();

      mouseX = e.clientX;
      mouseY = e.clientY;

      const dt = now - prevTime || 16;

      const vx = mouseX - prevX;
      const vy = mouseY - prevY;

      const speed = Math.sqrt(vx * vx + vy * vy) / dt;

      const { x: centerX, y: centerY } = getCenter();

      const toCenterBefore = Math.hypot(
        prevX - centerX,
        prevY - centerY
      );

      const toCenterAfter = Math.hypot(
        mouseX - centerX,
        mouseY - centerY
      );

      const movingTowardBear = toCenterAfter < toCenterBefore;

      const currentAngle = Math.atan2(
        mouseY - centerY,
        mouseX - centerX
      );

      if (lastAngle !== null) {
        let delta = currentAngle - lastAngle;

        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        accumulatedRotation += delta;
      }

      lastAngle = currentAngle;

      const completedLoop =
        Math.abs(accumulatedRotation) > Math.PI * 1.8;

      const circlingBear =
        completedLoop &&
        speed > 0.8 &&
        toCenterAfter < 220;

      if (circlingBear) {
        dizzyUntil = now + 2000;
        accumulatedRotation = 0;
        lastAngle = null;
      }

      if (toCenterAfter > 260) {
        accumulatedRotation = 0;
        lastAngle = null;
      }

      browLiftAmount =
        movingTowardBear &&
        speed > 1.2 &&
        toCenterAfter < 180
          ? Math.min(speed * 5, 3.5)
          : 0;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        browLiftAmount = 0;
      }, 120);

      prevX = mouseX;
      prevY = mouseY;
      prevTime = now;
    });

    animateBear();
  }

  const projects = [
    { title: 'JibberJabbler', icon: 'Projects/JibberJabbler.png', link: 'https://jabbler.jambles.fun/' },
    { title: 'Know-Frills', icon: 'Projects/Know-Frills.png', link: 'https://knowfrills.jambles.fun/' },
    { title: 'Tools4Teaching', icon: 'Projects/Tools4Teaching.png', link: 'https://tools4teaching.online/' },
    { title: 'Adachi-Jisho', icon: 'Projects/Adachi-Jisho.png', link: 'https://adachi-jisho.jambles.fun/' }
  ];

  const posts = document.querySelector('.posts');
  projects.forEach(project => {
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = project.link;
    a.innerHTML = `
      <img src="${project.icon}" alt="${project.title}" class="page-link-img" loading="lazy" decoding="async">
    `;
    posts.appendChild(a);
  });

  const dogImg = document.getElementById('dog-img');
  if (dogImg) {
    let dogTimeout = null;
    dogImg.addEventListener('click', () => {
      dogImg.src = 'Assets/frame2.png';
      
      const audio = new Audio('Assets/Yoshi mlem sound effect.mp3');
      audio.play();
      
      clearTimeout(dogTimeout);
      dogTimeout = setTimeout(() => {
        dogImg.src = 'Assets/frame1.png';
      }, 500);
    });
  }

  window.addEventListener('load', startBearAnimation);
});
