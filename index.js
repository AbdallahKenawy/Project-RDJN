document.addEventListener('DOMContentLoaded', () => {
    const comments = [
        {
            "Surnom": "TAC",
            "Phrase": "Askip j'ai pas le droit de jeter mon sac et swinguer ailleurs"
           },
           {
            "Surnom": "Caramel ",
            "Phrase": "SAMBA est ton nouveau mot d'ordre"
           },
           {
            "Surnom": "TIC",
            "Phrase": "arrêtez vos messages génériques à la SFR"
           },
           {
            "Surnom": "RoccoFuite",
            "Phrase": "Bon les loulous j’vous aime bien mais faudrait voter Rose pour continuer de swinguer toute l’année. Bisous do Braziiilll 🩷"
           },
           {
            "Surnom": "TGA",
            "Phrase": "Plonge dans l'énergie vibrante du Carnaval Rose Samba !"
           },
           {
            "Surnom": "Rohki",
            "Phrase": "Écoutez « T’as les cramptés ? Apagnan » sans modération."
           },
           {
            "Surnom": "Margarine",
            "Phrase": "Viens swinguer avec nous 🩷"
           },
           {
            "Surnom": "Blu",
            "Phrase": "Gros bisous de la part d’un oiseau bleu 🩷"
           },
           {
            "Surnom": "QLG",
            "Phrase": "Un Carnaval: des danses, de la musique et du rose"
           },
           {
            "Surnom": "Rapido",
            "Phrase": "Je vous fait un comtpe renu promiiiiiiis"
           },
           {
            "Surnom": "LFDMV",
            "Phrase": "Préparez vous pour une campagne de folie, une ambiance de fou et surtout du sourire et de la bonne humeur au max🩷"
           },
           {
            "Surnom": "Chariot",
            "Phrase": "Tenez vous prêts les RJNT arrivent🩷🩷"
           },
           {
            "Surnom": "Bourriquet ",
            "Phrase": "Tu es beau, tu es rose, n’arrête jamais de swinguer (hihannn)"
           },
           {
            "Surnom": "Amaretôt ",
            "Phrase": "t’as pas les couilles de voter rose 🩷"
           },
           {
            "Surnom": "Nagui",
            "Phrase": "Viens swinger avec RNJT sinon mon pote Alain te laissera jamais rentrer"
           },
           {
            "Surnom": "Englégu",
            "Phrase": "JRH voterait rose s’il était amicaliste; source Hugo décrypte"
           },
           {
            "Surnom": "Dahak",
            "Phrase": "Parce que le carnaval c’est toute l’année à l’INSA ! 💃"
           },
           {
            "Surnom": "Scoobabou",
            "Phrase": "Je pense qu’après avoir vécu la campagne rose on pourrait mourir tranquille !!"
           },
           {
            "Surnom": "Joggo",
            "Phrase": "Rose un jour, Rose toujours"
           },
           {
            "Surnom": 404,
            "Phrase": "J’espère que vous êtes chauds pour swinguer avec nous pendant 2 semaines de folie les Swingers ! 🩷💃"
           },
           {
            "Surnom": "The Roch",
            "Phrase": "Viens rigoler avec Dahak et ses copaings!"
           },
           {
            "Surnom": "Mecanik ",
            "Phrase": "En vrai ça va être golri de zinzin"
           },
           {
            "Surnom": "Trognon",
            "Phrase": "Les RJNT sont là pour vous pour vous embarquer au pays de la Samba. Venez swinguer avec nous🩷"
           },
           {
            "Surnom": "Com SAH",
            "Phrase": "Éclatez vous pendant ces semaines de foliiieeess !!! Samba 💃"
           },
           {
            "Surnom": "Swinger",
            "Phrase": "Salut les swingers, on espère que vous vivez la meilleure campagne de votre vie, alors profitez à fond de ces moments !! Et n’oubliez pas, ça va SWINGUER 🩷"
           },
           {
            "Surnom": "Amblance",
            "Phrase": "Salut minot !! aujourd’hui tu vas voir la vie en rose avec RJNT. Prêt(e) a swinger ? 🩷🩷"
           },
           {
            "Surnom": "Chiantos",
            "Phrase": "Fais pas chier et viens swinguer ;)"
           },
           {
            "Surnom": "PDG",
            "Phrase": "Toute occasion est bonne pour swinger !)"
           },
           {
            "Surnom": "Animaslayyy",
            "Phrase": "Vois la vie en Rose avec RJNT"
           },
           {
            "Surnom": "Rapido",
            "Phrase": "Coucou loulou, avec mon équipe de Swinger dou Brasil, on a imaginer une campagne de malade alors profite bien et viens danser la samba avec nous. Tu ne revivra pas ça de si tôt! Gros bisou sur tes petites fesses."
           },
           {
            "Surnom": "AwA",
            "Phrase": "Michel c’est le Brésil, il danse la Samba, il va de ville en ville, pour vendre des fenêtres 🎵"
           },
           {
            "Surnom": "Dino ",
            "Phrase": "hésitez pas à swinguer quotidiennement pour un maximum de fun"
           },
           {
            "Surnom": "Krist",
            "Phrase": "Viens swinguer et profiter de la campagne à fond !"
           },
           {
            "Surnom": "Poulet dentsans",
            "Phrase": "tout beau tout ROSE 🩷"
           },
           {
            "Surnom": "Paradise",
            "Phrase": "Les gars les gars les gars venez swinguer avec nous toute la nuit"
           },
           {
            "Surnom": "Aflaflou ",
            "Phrase": "Insassiens, Insassiennes, le carnaval s’invite dans vos vies aujourd’hui. Profitez des deux semaines de folie, ça va swinguer ! 🩷"
           },
           {
            "Surnom": "FIP GE",
            "Phrase": "Salut chef, t’es magnifique aujourd’hui mais tu le serais encore plus avec une touche de rose 😉🩷"
           },
           {
            "Surnom": "Lindt ",
            "Phrase": "Vous êtes tous trop beaux en rose 🩷"
           },
           {
            "Surnom": "Flash",
            "Phrase": "Il faut sachez que les RJNT gambergent, BIEN SUR OUIII"
           },
           {
            "Surnom": "Tupac ",
            "Phrase": "='J'adore Excel'"
           },
           {
            "Surnom": "WD40",
            "Phrase": "J'espère qu'on va réussir à vous faire kiffer un max les ptits potes 🥰"
           },
           {
            "Surnom": "Blu",
            "Phrase": "Et vous avez pas encore vu la fin …"
           },
           {
            "Surnom": "Razmo",
            "Phrase": "Pas de panique à bord, le fun et la samba d'abord!"
           },
           {
            "Surnom": "Mecanik ",
            "Phrase": "Samba dou blazilllllll"
           },
           {
            "Surnom": "TIC",
            "Phrase": "Salam les khouyas ! Vous êtes plus beaux que le lever du soleil sur une plage de Rio, mais en rose, vous serez aussi éblouissants qu'un flamant rose en tutu!"
           }
    ];

    let currentIndex = 0;
    let isPaused = false;
    let interval;

    function displayComment(index, direction) {
        const commentaryContent = document.getElementById('commentary-content');
        const { Surnom, Phrase } = comments[index];

        // Create a temporary container for the new comment
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `"${Phrase}" <br>~${Surnom}`;
        tempDiv.classList.add('commentary-text',direction === 'next' ? 'slide-in-left' : 'slide-in-right');

        // Clear previous content and add new content with animation
        commentaryContent.innerHTML = '';
        commentaryContent.appendChild(tempDiv);
    }

    document.getElementById('next').addEventListener('click', () => {
        stopAutoScroll();
        currentIndex = (currentIndex + 1) % comments.length;
        displayComment(currentIndex, 'next');
        startAutoScroll();
    });

    document.getElementById('prev').addEventListener('click', () => {
        stopAutoScroll();
        currentIndex = (currentIndex - 1 + comments.length) % comments.length;
        displayComment(currentIndex, 'prev');
        startAutoScroll();
    });

    function cycleComments() {
        if (!isPaused) {
            currentIndex = (currentIndex + 1) % comments.length;
            displayComment(currentIndex);
        }
    }

    function startAutoScroll() {
        if (!interval) {
            interval = setInterval(cycleComments, 3500); // Adjust timing to include fade effect
        }
    }

    function stopAutoScroll() {
        clearInterval(interval);
        interval = null;
    }

    document.getElementById('pause').addEventListener('click', () => {
        const pauseButton = document.getElementById('pause');
        if (isPaused) {
            startAutoScroll();
            pauseButton.textContent = 'Pause';
            isPaused = false;
        } else {
            stopAutoScroll();
            pauseButton.textContent = 'Resume';
            isPaused = true;
        }
    });

    // Initialize
    displayComment(currentIndex); // Display the first comment
    startAutoScroll(); // Start the automatic cycling of comments
});
