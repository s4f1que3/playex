import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      movies: "Movies",
      tvShows: "TV Shows",
      collections: "Collections",
      search: "Search",
      myList: "My List",
      account: "Account",
      trending: "Trending",
      fanFavorites: "Fan Favorites",
      
      // Sections
      quickActions: "Quick Actions",
      featured: "Featured",
      navigation: "Navigation",
      quickLinks: "Quick Links",
      legal: "Legal",
      
      // Header
      searchPlaceholder: "Search movies, TV shows...",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      
      // Common
      loading: "Loading...",
      error: "Error",
      tryAgain: "Try Again",
      seeMore: "See More",
      viewAll: "View All",
      play: "Play",
      addToList: "Add to List",
      removeFromList: "Remove from List",
      share: "Share",
      details: "Details",
      
      // Media Details
      overview: "Overview",
      cast: "Cast",
      crew: "Crew",
      seasons: "Seasons",
      episodes: "Episodes",
      similar: "Similar",
      recommendations: "Recommendations",
      trailer: "Trailer",
      rating: "Rating",
      releaseDate: "Release Date",
      runtime: "Runtime",
      genres: "Genres",
      director: "Director",
      writers: "Writers",
      
      // Filters
      filter: "Filter",
      sortBy: "Sort By",
      year: "Year",
      genre: "Genre",
      language: "Language",
      rating: "Rating",
      popularity: "Popularity",
      releaseDate: "Release Date",
      title: "Title",
      
      // User Actions
      favorites: "Favorites",
      watchlist: "Watchlist",
      watched: "Watched",
      continueWatching: "Continue Watching",
      
      // Footer
      aboutUs: "About Us",
      contactUs: "Contact Us",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      faq: "FAQ",
      cookiesPolicy: "Cookies Policy",
      adBlockers: "Ad Blockers",
      
      // Time
      min: "min",
      hours: "hours",
      seasons_one: "{{count}} Season",
      seasons_other: "{{count}} Seasons",
      episodes_one: "{{count}} Episode",
      episodes_other: "{{count}} Episodes",
    }
  },
  es: {
    translation: {
      // Navigation
      home: "Inicio",
      movies: "Películas",
      tvShows: "Series",
      collections: "Colecciones",
      search: "Buscar",
      myList: "Mi Lista",
      account: "Cuenta",
      trending: "Tendencias",
      fanFavorites: "Favoritos de Fans",
      
      // Sections
      quickActions: "Acciones Rápidas",
      featured: "Destacado",
      navigation: "Navegación",
      quickLinks: "Enlaces Rápidos",
      legal: "Legal",
      
      // Header
      searchPlaceholder: "Buscar películas, series...",
      login: "Iniciar Sesión",
      signup: "Registrarse",
      logout: "Cerrar Sesión",
      
      // Common
      loading: "Cargando...",
      error: "Error",
      tryAgain: "Intentar de Nuevo",
      seeMore: "Ver Más",
      viewAll: "Ver Todo",
      play: "Reproducir",
      addToList: "Añadir a la Lista",
      removeFromList: "Quitar de la Lista",
      share: "Compartir",
      details: "Detalles",
      
      // Media Details
      overview: "Sinopsis",
      cast: "Reparto",
      crew: "Equipo",
      seasons: "Temporadas",
      episodes: "Episodios",
      similar: "Similar",
      recommendations: "Recomendaciones",
      trailer: "Tráiler",
      rating: "Calificación",
      releaseDate: "Fecha de Estreno",
      runtime: "Duración",
      genres: "Géneros",
      director: "Director",
      writers: "Guionistas",
      
      // Filters
      filter: "Filtrar",
      sortBy: "Ordenar Por",
      year: "Año",
      genre: "Género",
      language: "Idioma",
      rating: "Calificación",
      popularity: "Popularidad",
      releaseDate: "Fecha de Estreno",
      title: "Título",
      
      // User Actions
      favorites: "Favoritos",
      watchlist: "Lista de Seguimiento",
      watched: "Visto",
      continueWatching: "Continuar Viendo",
      
      // Footer
      aboutUs: "Sobre Nosotros",
      contactUs: "Contáctanos",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      faq: "Preguntas Frecuentes",
      cookiesPolicy: "Política de Cookies",
      adBlockers: "Bloqueadores de Anuncios",
      
      // Time
      min: "min",
      hours: "horas",
      seasons_one: "{{count}} Temporada",
      seasons_other: "{{count}} Temporadas",
      episodes_one: "{{count}} Episodio",
      episodes_other: "{{count}} Episodios",
    }
  },
  fr: {
    translation: {
      // Navigation
      home: "Accueil",
      movies: "Films",
      tvShows: "Séries",
      collections: "Collections",
      search: "Rechercher",
      myList: "Ma Liste",
      account: "Compte",
      trending: "Tendances",
      fanFavorites: "Favoris des Fans",
      
      // Sections
      quickActions: "Actions Rapides",
      featured: "En Vedette",
      navigation: "Navigation",
      quickLinks: "Liens Rapides",
      legal: "Légal",
      
      // Header
      searchPlaceholder: "Rechercher des films, séries...",
      login: "Connexion",
      signup: "S'inscrire",
      logout: "Déconnexion",
      
      // Common
      loading: "Chargement...",
      error: "Erreur",
      tryAgain: "Réessayer",
      seeMore: "Voir Plus",
      viewAll: "Tout Voir",
      play: "Lire",
      addToList: "Ajouter à la Liste",
      removeFromList: "Retirer de la Liste",
      share: "Partager",
      details: "Détails",
      
      // Media Details
      overview: "Synopsis",
      cast: "Distribution",
      crew: "Équipe",
      seasons: "Saisons",
      episodes: "Épisodes",
      similar: "Similaire",
      recommendations: "Recommandations",
      trailer: "Bande-annonce",
      rating: "Note",
      releaseDate: "Date de Sortie",
      runtime: "Durée",
      genres: "Genres",
      director: "Réalisateur",
      writers: "Scénaristes",
      
      // Filters
      filter: "Filtrer",
      sortBy: "Trier Par",
      year: "Année",
      genre: "Genre",
      language: "Langue",
      rating: "Note",
      popularity: "Popularité",
      releaseDate: "Date de Sortie",
      title: "Titre",
      
      // User Actions
      favorites: "Favoris",
      watchlist: "Liste de Suivi",
      watched: "Vu",
      continueWatching: "Continuer à Regarder",
      
      // Footer
      aboutUs: "À Propos",
      contactUs: "Nous Contacter",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
      faq: "FAQ",
      cookiesPolicy: "Politique des Cookies",
      adBlockers: "Bloqueurs de Publicité",
      
      // Time
      min: "min",
      hours: "heures",
      seasons_one: "{{count}} Saison",
      seasons_other: "{{count}} Saisons",
      episodes_one: "{{count}} Épisode",
      episodes_other: "{{count}} Épisodes",
    }
  },
  de: {
    translation: {
      // Navigation
      home: "Startseite",
      movies: "Filme",
      tvShows: "Serien",
      collections: "Sammlungen",
      search: "Suchen",
      myList: "Meine Liste",
      account: "Konto",
      trending: "Trending",
      fanFavorites: "Fan-Favoriten",
      
      // Sections
      quickActions: "Schnellaktionen",
      featured: "Empfohlen",
      navigation: "Navigation",
      quickLinks: "Schnelllinks",
      legal: "Rechtliches",
      
      // Header
      searchPlaceholder: "Filme, Serien suchen...",
      login: "Anmelden",
      signup: "Registrieren",
      logout: "Abmelden",
      
      // Common
      loading: "Laden...",
      error: "Fehler",
      tryAgain: "Erneut Versuchen",
      seeMore: "Mehr Sehen",
      viewAll: "Alle Anzeigen",
      play: "Abspielen",
      addToList: "Zur Liste Hinzufügen",
      removeFromList: "Von Liste Entfernen",
      share: "Teilen",
      details: "Details",
      
      // Media Details
      overview: "Übersicht",
      cast: "Besetzung",
      crew: "Team",
      seasons: "Staffeln",
      episodes: "Episoden",
      similar: "Ähnlich",
      recommendations: "Empfehlungen",
      trailer: "Trailer",
      rating: "Bewertung",
      releaseDate: "Erscheinungsdatum",
      runtime: "Laufzeit",
      genres: "Genres",
      director: "Regisseur",
      writers: "Drehbuchautoren",
      
      // Filters
      filter: "Filtern",
      sortBy: "Sortieren Nach",
      year: "Jahr",
      genre: "Genre",
      language: "Sprache",
      rating: "Bewertung",
      popularity: "Beliebtheit",
      releaseDate: "Erscheinungsdatum",
      title: "Titel",
      
      // User Actions
      favorites: "Favoriten",
      watchlist: "Merkliste",
      watched: "Gesehen",
      continueWatching: "Weiterschauen",
      
      // Footer
      aboutUs: "Über Uns",
      contactUs: "Kontakt",
      privacyPolicy: "Datenschutz",
      termsOfService: "Nutzungsbedingungen",
      faq: "FAQ",
      cookiesPolicy: "Cookie-Richtlinie",
      adBlockers: "Werbeblocker",
      
      // Time
      min: "Min",
      hours: "Stunden",
      seasons_one: "{{count}} Staffel",
      seasons_other: "{{count}} Staffeln",
      episodes_one: "{{count}} Episode",
      episodes_other: "{{count}} Episoden",
    }
  },
  pt: {
    translation: {
      // Navigation
      home: "Início",
      movies: "Filmes",
      tvShows: "Séries",
      collections: "Coleções",
      search: "Buscar",
      myList: "Minha Lista",
      account: "Conta",
      trending: "Tendências",
      fanFavorites: "Favoritos dos Fãs",
      
      // Sections
      quickActions: "Ações Rápidas",
      featured: "Destaques",
      navigation: "Navegação",
      quickLinks: "Links Rápidos",
      legal: "Legal",
      
      // Header
      searchPlaceholder: "Buscar filmes, séries...",
      login: "Entrar",
      signup: "Cadastrar",
      logout: "Sair",
      
      // Common
      loading: "Carregando...",
      error: "Erro",
      tryAgain: "Tentar Novamente",
      seeMore: "Ver Mais",
      viewAll: "Ver Tudo",
      play: "Reproduzir",
      addToList: "Adicionar à Lista",
      removeFromList: "Remover da Lista",
      share: "Compartilhar",
      details: "Detalhes",
      
      // Media Details
      overview: "Sinopse",
      cast: "Elenco",
      crew: "Equipe",
      seasons: "Temporadas",
      episodes: "Episódios",
      similar: "Semelhante",
      recommendations: "Recomendações",
      trailer: "Trailer",
      rating: "Avaliação",
      releaseDate: "Data de Lançamento",
      runtime: "Duração",
      genres: "Gêneros",
      director: "Diretor",
      writers: "Roteiristas",
      
      // Filters
      filter: "Filtrar",
      sortBy: "Ordenar Por",
      year: "Ano",
      genre: "Gênero",
      language: "Idioma",
      rating: "Avaliação",
      popularity: "Popularidade",
      releaseDate: "Data de Lançamento",
      title: "Título",
      
      // User Actions
      favorites: "Favoritos",
      watchlist: "Lista de Acompanhamento",
      watched: "Assistido",
      continueWatching: "Continuar Assistindo",
      
      // Footer
      aboutUs: "Sobre Nós",
      contactUs: "Fale Conosco",
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
      faq: "Perguntas Frequentes",
      cookiesPolicy: "Política de Cookies",
      adBlockers: "Bloqueadores de Anúncios",
      
      // Time
      min: "min",
      hours: "horas",
      seasons_one: "{{count}} Temporada",
      seasons_other: "{{count}} Temporadas",
      episodes_one: "{{count}} Episódio",
      episodes_other: "{{count}} Episódios",
    }
  },
  it: {
    translation: {
      // Navigation
      home: "Home",
      movies: "Film",
      tvShows: "Serie TV",
      collections: "Collezioni",
      search: "Cerca",
      myList: "La Mia Lista",
      account: "Account",
      trending: "Di Tendenza",
      fanFavorites: "Preferiti dai Fan",
      
      // Sections
      quickActions: "Azioni Rapide",
      featured: "In Evidenza",
      navigation: "Navigazione",
      quickLinks: "Link Rapidi",
      legal: "Legale",
      
      // Header
      searchPlaceholder: "Cerca film, serie TV...",
      login: "Accedi",
      signup: "Registrati",
      logout: "Esci",
      
      // Common
      loading: "Caricamento...",
      error: "Errore",
      tryAgain: "Riprova",
      seeMore: "Vedi Altro",
      viewAll: "Vedi Tutto",
      play: "Riproduci",
      addToList: "Aggiungi alla Lista",
      removeFromList: "Rimuovi dalla Lista",
      share: "Condividi",
      details: "Dettagli",
      
      // Media Details
      overview: "Trama",
      cast: "Cast",
      crew: "Crew",
      seasons: "Stagioni",
      episodes: "Episodi",
      similar: "Simili",
      recommendations: "Raccomandazioni",
      trailer: "Trailer",
      rating: "Valutazione",
      releaseDate: "Data di Uscita",
      runtime: "Durata",
      genres: "Generi",
      director: "Regista",
      writers: "Sceneggiatori",
      
      // Filters
      filter: "Filtra",
      sortBy: "Ordina Per",
      year: "Anno",
      genre: "Genere",
      language: "Lingua",
      rating: "Valutazione",
      popularity: "Popolarità",
      releaseDate: "Data di Uscita",
      title: "Titolo",
      
      // User Actions
      favorites: "Preferiti",
      watchlist: "Lista da Vedere",
      watched: "Visto",
      continueWatching: "Continua a Guardare",
      
      // Footer
      aboutUs: "Chi Siamo",
      contactUs: "Contattaci",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Termini di Servizio",
      faq: "FAQ",
      cookiesPolicy: "Politica sui Cookie",
      adBlockers: "Blocco Pubblicità",
      
      // Time
      min: "min",
      hours: "ore",
      seasons_one: "{{count}} Stagione",
      seasons_other: "{{count}} Stagioni",
      episodes_one: "{{count}} Episodio",
      episodes_other: "{{count}} Episodi",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false, // Disable suspense to avoid context issues
    },
  });

export default i18n;
