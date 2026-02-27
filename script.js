const skills = [
	{
		name: 'HTML / CSS',
		image: 'public/htmlcss.png',
		description: `Je maîtrise les langages HTML et CSS pour structurer et styliser des pages web, permettant de créer des interfaces claires et responsives.`,
	},
	{
		name: 'JavaScript',
		image: 'public/js.png',
		description: `J'utilise JavaScript pour créer des pages web interactives et manipuler le DOM, en améliorant l'expérience utilisateur.`,
	},
	{
		name: 'PHP',
		image: 'public/php.png',
		description: `Je connais les bases de PHP et la programmation orientée objet (POO), ce qui me permet de développer des applications web dynamiques.`,
	},
	{
		name: 'Python',
		image: 'public/python.png',
		description: `J'ai des bases en Python, que j'utilise pour résoudre des problèmes.`,
	},
	{
		name: 'React',
		description:
			"Je maîtrise le développement d'interfaces modernes et réactives avec React. J'utilise l'architecture par composants et les hooks pour créer des applications web fluides et performantes.",
		image: 'public/react.png',
	},
	{
		name: 'Symfony',
		description:
			"Je développe des applications structurées avec le framework PHP Symfony. Je possède de bonnes bases sur l'architecture MVC,\n la gestion de bases de données avec Doctrine et le moteur Twig.",
		image: 'public/symfony.jpeg',
    },
    {
    name: "React Native",
    description: "Je possède quelques notions de base sur React Native pour la création d'applications mobiles.",
    image: "public/react_native.png"
    },
	{
		name: 'SQL',
		image: 'public/sql.webp',
		description: `Je sais interroger des bases de données SQL, gérer des données et optimiser les requêtes pour un meilleur rendement.`,
	},
	{
		name: 'Wordpress',
		image: 'public/wordpress.jpg',
		description: `Je sais créer et gérer des sites web avec WordPress, en utilisant des thèmes et des extensions pour répondre aux besoins du projet.`,
	},
	{
		name: 'Elementor',
		image: 'public/elementor.webp',
		description: `J'utilise Elementor pour concevoir des pages web modernes et responsives, sans coder, grâce à son interface intuitive en\n glisser-déposer.`,
	},
];

let currentIndex = 0;

function updateCarousel() {
	const display = document.getElementById('carousel-display');
	const skill = skills[currentIndex];
	display.innerHTML = `
        <img src="${skill.image}" alt="${skill.name}">
        <h3>${skill.name}</h3>
        <p class="skill-description" style="white-space: pre-line;">${skill.description}</p>
    `;
}
document.getElementById('prevBtn').onclick = () => {
	currentIndex = (currentIndex - 1 + skills.length) % skills.length;
	updateCarousel();
};

document.getElementById('nextBtn').onclick = () => {
	currentIndex = (currentIndex + 1) % skills.length;
	updateCarousel();
};

// Modal CV

const cvButton = document.getElementById('cv-button');
const cvModal = document.getElementById('cv-modal');
const closeModal = document.getElementById('close-modal');

// Ouvrir la modal
cvButton.addEventListener('click', () => {
	cvModal.style.display = 'block';
	document.body.classList.add('modal-open'); // BLOQUE LE SCROLL DU SITE
});

// Fermer la modal
closeModal.addEventListener('click', () => {
	cvModal.style.display = 'none';
	document.body.classList.remove('modal-open'); // RÉACTIVE LE SCROLL
});

// Fermer si on clique à côté du CV
window.addEventListener('click', (event) => {
	if (event.target === cvModal) {
		cvModal.style.display = 'none';
		document.body.classList.remove('modal-open');
	}
});

// Init
updateCarousel();
