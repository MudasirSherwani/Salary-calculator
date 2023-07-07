function toggleDarkMode() { // jshint ignore:line
  const toggler = document.getElementById('dark-mode-toggler');

  if (toggler.getAttribute('aria-pressed') === 'false') {
    toggler.setAttribute('aria-pressed', 'true');
    document.documentElement.classList.add('is-dark-theme');
    document.body.classList.add('is-dark-theme');
    window.localStorage.setItem('twentytwentyoneDarkMode', 'yes');
  } else {
    toggler.setAttribute('aria-pressed', 'false');
    document.documentElement.classList.remove('is-dark-theme');
    document.body.classList.remove('is-dark-theme');
    window.localStorage.setItem('twentytwentyoneDarkMode', 'no');
  }
}

function twentytwentyoneIsDarkMode() {
  let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (window.localStorage.getItem('twentytwentyoneDarkMode') === 'yes') {
    isDarkMode = true;
  } else if (window.localStorage.getItem('twentytwentyoneDarkMode') === 'no') {
    isDarkMode = false;
  }

  return isDarkMode;
}

function darkModeInitialLoad() {
  const toggler = document.getElementById('dark-mode-toggler');
  const isDarkMode = twentytwentyoneIsDarkMode();

  if (isDarkMode) {
    document.documentElement.classList.add('is-dark-theme');
    document.body.classList.add('is-dark-theme');
  } else {
    document.documentElement.classList.remove('is-dark-theme');
    document.body.classList.remove('is-dark-theme');
  }

  if (toggler && isDarkMode) {
    toggler.setAttribute('aria-pressed', 'true');
  }
}

function darkModeRepositionTogglerOnScroll() {
  const toggler = document.getElementById('dark-mode-toggler');
  let prevScroll = window.scrollY || document.documentElement.scrollTop;
  let currentScroll;

  const checkScroll = function () {
    currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (
      currentScroll + (window.innerHeight * 1.5) > document.body.clientHeight
				|| currentScroll < prevScroll
    ) {
      toggler.classList.remove('hide');
    } else if (currentScroll > prevScroll && currentScroll > 250) {
      toggler.classList.add('hide');
    }
    prevScroll = currentScroll;
  };

  if (toggler) {
    window.addEventListener('scroll', checkScroll);
  }
}

darkModeInitialLoad();
darkModeRepositionTogglerOnScroll();
