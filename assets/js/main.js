document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('open');
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });

    // Gestion du header fixe au défilement
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Ajouter/supprimer la classe 'scrolled' sur le header
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Masquer le header lors du défilement vers le bas, l'afficher vers le haut
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Défilement vers le bas
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Défilement vers le haut
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Gestion des labels flottants et de la validation du formulaire
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('.form-control');
        const formSelects = contactForm.querySelectorAll('select');
        const formSubmit = contactForm.querySelector('.btn-submit');
        
        // Fonction pour gérer les labels flottants
        function handleFloatLabel(input) {
            const parent = input.parentElement;
            const label = parent.querySelector('label');
            
            if (!label) return;
            
            // Vérifier si le champ a une valeur ou est en focus
            if (input.value.trim() !== '' || document.activeElement === input) {
                parent.classList.add('focused');
                label.classList.add('floating');
            } else {
                parent.classList.remove('focused');
                label.classList.remove('floating');
            }
            
            // Validation en temps réel
            validateField(input);
        }
        
        // Fonction de validation des champs
        function validateField(input) {
            const parent = input.parentElement;
            const errorMessage = parent.querySelector('.error-message');
            let isValid = true;
            
            // Réinitialiser les classes d'erreur
            parent.classList.remove('error', 'valid');
            
            // Vérifier si le champ est requis
            if (input.hasAttribute('required') && input.value.trim() === '') {
                showError(parent, errorMessage, 'Ce champ est obligatoire');
                isValid = false;
            } 
            // Validation de l'email
            else if (input.type === 'email' && input.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    showError(parent, errorMessage, 'Veuillez entrer une adresse email valide');
                    isValid = false;
                }
            }
            // Validation du téléphone (optionnel)
            else if (input.type === 'tel' && input.value.trim() !== '') {
                const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
                if (!phoneRegex.test(input.value.trim())) {
                    showError(parent, errorMessage, 'Veuillez entrer un numéro de téléphone valide');
                    isValid = false;
                }
            }
            
            // Si le champ est valide
            if (isValid && input.value.trim() !== '') {
                parent.classList.add('valid');
                if (errorMessage) errorMessage.style.display = 'none';
            }
            
            return isValid;
        }
        
        // Afficher un message d'erreur
        function showError(parent, errorElement, message) {
            parent.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'flex';
            }
        }
        
        // Gestion des événements pour les champs de formulaire
        formInputs.forEach(input => {
            // Événement de focus
            input.addEventListener('focus', function() {
                const parent = this.parentElement;
                parent.classList.add('focused');
                const label = parent.querySelector('label');
                if (label) label.classList.add('floating');
            });
            
            // Événement de perte de focus
            input.addEventListener('blur', function() {
                handleFloatLabel(this);
            });
            
            // Validation en temps réel
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            // Initialisation des champs
            handleFloatLabel(input);
        });
        
        // Gestion des sélecteurs
        formSelects.forEach(select => {
            const parent = select.parentElement;
            const label = parent.querySelector('label');
            
            select.addEventListener('change', function() {
                if (this.value) {
                    parent.classList.add('filled');
                    if (label) label.classList.add('floating');
                } else {
                    parent.classList.remove('filled');
                    if (label) label.classList.remove('floating');
                }
                validateField(this);
            });
            
            // Initialisation du sélecteur
            if (select.value) {
                parent.classList.add('filled');
                if (label) label.classList.add('floating');
            }
        });
        
        // Soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            
            // Valider tous les champs
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            
            formSelects.forEach(select => {
                if (!validateField(select)) {
                    isFormValid = false;
                }
            });
            
            // Si le formulaire est valide, simuler l'envoi
            if (isFormValid) {
                // Afficher l'état de chargement
                if (formSubmit) {
                    formSubmit.disabled = true;
                    formSubmit.classList.add('loading');
                }
                
                // Simuler un délai d'envoi
                setTimeout(() => {
                    // Cacher le formulaire et afficher le message de succès
                    contactForm.classList.add('submitted');
                    
                    // Réinitialiser le formulaire après l'envoi
                    contactForm.reset();
                    
                    // Réinitialiser les états des champs
                    formInputs.forEach(input => {
                        const parent = input.parentElement;
                        parent.classList.remove('focused', 'valid');
                        const label = parent.querySelector('label');
                        if (label) label.classList.remove('floating');
                    });
                    
                    // Réinitialiser les sélecteurs
                    formSelects.forEach(select => {
                        const parent = select.parentElement;
                        parent.classList.remove('filled');
                        const label = parent.querySelector('label');
                        if (label) label.classList.remove('floating');
                    });
                    
                    // Réinitialiser le bouton d'envoi
                    if (formSubmit) {
                        formSubmit.disabled = false;
                        formSubmit.classList.remove('loading');
                    }
                    
                    // Réinitialiser après 5 secondes
                    setTimeout(() => {
                        contactForm.classList.remove('submitted');
                    }, 5000);
                    
                }, 1500);
            } else {
                // Faire défiler jusqu'au premier champ en erreur
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    }

    // Animation au défilement
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    // Initialisation des animations
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});
