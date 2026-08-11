/* ==========================================================================
   INTERACTIVITÉ JAVASCRIPT - OR ET LES MENTORS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. COMPORTEMENT DE LA BARRE DE NAVIGATION (SCROLL EFFECT) */
  const nav = document.querySelector('nav');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Appel initial au cas où la page est déjà défilée au chargement
  handleScroll();


  /* 2. MENU MOBILE TACTILE (BURGER) */
  const burgerMenu = document.querySelector('.burger-menu');
  const navLiens = document.querySelector('.nav-liens');
  const navLinks = document.querySelectorAll('.nav-liens a');

  const toggleMenu = () => {
    burgerMenu.classList.toggle('open');
    navLiens.classList.toggle('open');
    // Empêcher le défilement en arrière-plan quand le menu est ouvert
    document.body.style.overflow = navLiens.classList.contains('open') ? 'hidden' : '';
  };

  burgerMenu.addEventListener('click', toggleMenu);

  // Fermer le menu lors du clic sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLiens.classList.contains('open')) {
        toggleMenu();
      }
    });
  });


  /* 3. CAROUSEL DES TÉMOIGNAGES */
  const slides = document.querySelectorAll('.temo-slide');
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');
  const indicateursContainer = document.querySelector('.carousel-indicateurs');
  let indexActuel = 0;
  let carouselInterval;

  // Création des indicateurs (petits ronds)
  slides.forEach((_, idx) => {
    const rond = document.createElement('div');
    rond.classList.add('indicateur');
    if (idx === 0) rond.classList.add('active');
    rond.addEventListener('click', () => changerSlide(idx));
    indicateursContainer.appendChild(rond);
  });

  const indicateurs = document.querySelectorAll('.indicateur');

  const changerSlide = (nouvelIndex) => {
    // Retirer la classe active de la slide et de l'indicateur actuel
    slides[indexActuel].classList.remove('active');
    indicateurs[indexActuel].classList.remove('active');

    // Mettre à jour l'index
    indexActuel = nouvelIndex;

    // Gérer les débordements
    if (indexActuel >= slides.length) indexActuel = 0;
    if (indexActuel < 0) indexActuel = slides.length - 1;

    // Ajouter la classe active à la nouvelle slide et au nouvel indicateur
    slides[indexActuel].classList.add('active');
    indicateurs[indexActuel].classList.add('active');
    
    // Réinitialiser l'auto-play au clic manuel
    lancerAutoPlay();
  };

  const slideSuivante = () => {
    changerSlide(indexActuel + 1);
  };

  const slidePrecedente = () => {
    changerSlide(indexActuel - 1);
  };

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', slideSuivante);
    prevBtn.addEventListener('click', slidePrecedente);
  }

  // Auto-play toutes les 7 secondes
  const lancerAutoPlay = () => {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(slideSuivante, 7000);
  };

  lancerAutoPlay();


  /* 4. ANIMATION D'APPARITION AU DÉFILEMENT (SCROLL REVEAL) */
  const elementsAReveler = document.querySelectorAll('.reveal');

  const observateurOptions = {
    root: null, // Viewport de l'utilisateur
    threshold: 0.1, // Déclenche dès que 10% de l'élément est visible
    rootMargin: '0px 0px -50px 0px' // Petite marge pour anticiper l'apparition
  };

  const observateur = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionnel : arrêter d'observer une fois animé
        observer.unobserve(entry.target);
      }
    });
  }, observateurOptions);

  elementsAReveler.forEach(el => {
    observateur.observe(el);
  });


  /* 5. FORMULAIRE DE CONTACT & TOAST DE SUCCÈS */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('success-toast');
  const toastTexte = toast.querySelector('.toast-texte');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Récupération des données du formulaire
      const nom = document.getElementById('form-nom').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const entreprise = document.getElementById('form-entreprise').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Validation basique
      if (!nom || !email || !message) {
        alert('Veuillez remplir tous les champs obligatoires (Nom, Email, Message).');
        return;
      }

      // Envoi réel vers Formspree via API Fetch
      const submitBtn = contactForm.querySelector('.form-bouton');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      const data = new FormData(contactForm);

      fetch('https://formspree.io/f/mojzgqja', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Message personnalisé dans le toast
          toastTexte.textContent = `Merci ${nom}, votre message a bien été envoyé !`;
          // Afficher le toast
          toast.classList.add('show');
          // Réinitialiser le formulaire
          contactForm.reset();
          // Masquer le toast après 4 secondes
          setTimeout(() => {
            toast.classList.remove('show');
          }, 4000);
        } else {
          response.json().then(data => {
            if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
              alert(data["errors"].map(error => error["message"]).join(", "));
            } else {
              alert("Oups ! Un problème est survenu lors de l'envoi de votre message. Veuillez réessayer.");
            }
          });
        }
      })
      .catch(error => {
        alert("Oups ! Un problème de réseau est survenu. Veuillez vérifier votre connexion et réessayer.");
        console.error(error);
      })
      .finally(() => {
        // Rétablir le bouton dans tous les cas
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  /* 6. MODALE DES MENTIONS LÉGALES */
  const openLegalBtn = document.getElementById('open-legal');
  const legalModal = document.getElementById('legal-modal');
  const closeElements = document.querySelectorAll('#legal-modal [data-close]');

  const openModal = (modal) => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (!navLiens.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  if (openLegalBtn && legalModal) {
    openLegalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(legalModal);
    });

    closeElements.forEach(el => {
      el.addEventListener('click', () => {
        closeModal(legalModal);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && legalModal.classList.contains('active')) {
        closeModal(legalModal);
      }
    });
  }

});

