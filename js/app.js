var app = angular.module("app", []);

app.controller("Controleur", ["$scope", "$http", "$filter", function ($scope, $http, $filter) {

    // Le code du contrôleur
    // localStorage.clear();
 
    // Données des cours
    $scope.saved = localStorage.getItem('data');
    if(localStorage.getItem('data')!==null)
    {
        $scope.coursSave=JSON.parse($scope.saved);
    }
    else
    {
        $scope.coursSave=[];
        localStorage.setItem('data', JSON.stringify($scope.coursSave));
    }

    // Données des professeurs
    if(localStorage.getItem('enseignants')) {
        $scope.enseignants = JSON.parse(localStorage.getItem('enseignants'));
    }
    else {
        $scope.enseignants = [];
    }
	
	// Données des salles
    if(localStorage.getItem('salles')) {
        $scope.salles = JSON.parse(localStorage.getItem('salles'));
    }
    else {
        $scope.salles = [];
    }
	
	// Données des classes
    if(localStorage.getItem('classes')) {
        $scope.classe = JSON.parse(localStorage.getItem('classes'));
    }
    else {
        $scope.classe = [];
    }
	
    // Si on fait directement new Date(), on aura une date comme "2016-02-14T14:06:25.869Z" alors qu'on veut juste "2016-02-14T00:00:00.000Z"
    // C'est pourquoi on fait un new Date en précisant bien l'année, le mois et le jour pour n'avoir que ce qu'on veut
    $scope.formatDate = function(date) {
        return new Date(date.getFullYear() + "-" + ('0' + parseInt(date.getMonth()+1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2));
    }

    // Mettre la date du jour pour voir l'emploi du temps du jour
    $scope.trieDate = $scope.formatDate(new Date());

    // Convertir les dates en format de $scope.coursSave texte en objet Date pour que les comparaisons soient plus faciles
    var dateTmp;
    for(var i=0; i<$scope.coursSave.length; i++) {
        dateTmp = $scope.coursSave[i].date.split("/");
        if(dateTmp[1] < 10) {
            dateTmp[1] = "0" + dateTmp[1];
        }
        if(dateTmp[0] < 10) {
            dateTmp[0] = "0" + dateTmp[0];
        }
        // Mettre la date temporaire au format Date dans une ligne du tableau
        // Cette varialbe dateTmp sera supprimée avant l'enregistrement de $scope.coursSave
        $scope.coursSave[i].dateTmp = new Date(dateTmp[2] + "-" + dateTmp[1] + "-" + dateTmp[0]);
    }
    delete dateTmp; // Surpprimer la variable temporaire

    $scope.videoProjecteur = 3;    
	
    // Différents tries disponibles
    $scope.trieOptions = [
        {name:"", value:0},
        {name:"Professeur", value:1},
        {name:"Classe", value:2}
    ];
    // Mettre la <select> à une valeur par défaut
    $scope.trieType = $scope.trieOptions[0].value;

    $scope.ajout = function () {
        var idEnseignant = $filter('getEnseignantId')($scope.enseignants, $scope.demande.enseignant);

        // Si il manque des champs, arrêter la fonction ici
        if (idEnseignant <= -1) {
            alert("Le login de l'enseignant n'est pas valide.");
            return;
        }
        var indexSalle = $filter('existeSalle')($scope.salles, $scope.demande.salle)
        if (!$scope.demande.salle || indexSalle == -1) {
            alert("La salle que vous avez entré n'existe pas.");
            return;
        }
        if($scope.classe[$scope.demande.classe].effectifClasse > $scope.salles[indexSalle].effectifSalle) {
            alert("La salle demandée n'est pas assez grande pour cette classe.");
            return;
        }
        if (!$scope.demande.classe || !$scope.demande.date || !$scope.demande.heureDebut || !$scope.demande.heureFin) {
            return;
        }
        if ($scope.demande.heureDebut.getTime() == $scope.demande.heureFin.getTime()) {
            alert("Les heures doivent être différentes.")
            return;
        }

        if ($scope.demande.heureDebut.getTime() == $scope.demande.heureFin.getTime()) {
            alert("Les heures doivent être différentes.");
            return;
        }
        if (!$scope.demande.heureDebut || !$scope.demande.heureFin) alert("Entrez une heure au format HH:MM exemple '08:00'");
        if (!$scope.demande.date) alert("Entrez une date au format AAAA-MM-JJ exemple '2015-12-25'");
        /*Verif moi et jours*/

        // Formater la date dans les champs heureDebut et heureFin
        $scope.demande.heureDebut.setDate($scope.demande.date.getDate());
        $scope.demande.heureDebut.setMonth($scope.demande.date.getMonth());
        $scope.demande.heureDebut.setFullYear($scope.demande.date.getFullYear());
        $scope.demande.heureFin.setDate($scope.demande.date.getDate());
        $scope.demande.heureFin.setMonth($scope.demande.date.getMonth());
        $scope.demande.heureFin.setFullYear($scope.demande.date.getFullYear());

        if($scope.demande.heureDebut > $scope.demande.heureFin)
        {
            alert("L'heure de début du cours est supérieur à la date de fin du cours");
            return;
        }
        dateactuelle = new Date();
        heureDebut = new Date ($scope.demande.heureDebut);
        heureFin = new Date ($scope.demande.heureFin);

        date = new Date($scope.demande.date);

        if(date < dateactuelle)
        {

            alert("La date renseignée doit être égale ou supérieur à la date actuelle");
            return;
        }


        if(heureDebut.getHours() < 9 || heureDebut.getHours() > 18 || heureFin.getHours() < 9 || heureFin.getHours() > 18)
        {
            alert("Les horaires indiquées ne sont pas paramétrés pour des cours");
            return;
        }

        var heureDebutFormat = heureDebut.getHours();
        if (heureDebut.getHours() < 10) {
            heureDebutFormat = "0"+heureDebutFormat;
        }

        var minutesDebutFormat = heureDebut.getMinutes();
        if (heureDebut.getMinutes() < 10){
            minutesDebutFormat = "0"+minutesDebutFormat;
        }

        var heureFinFormat = heureFin.getHours();
        if (heureFin.getHours() < 10) {
            heureFinFormat = "0"+heureFinFormat;
        }

        var minutesFinFormat = heureFin.getMinutes();
        if (heureFin.getMinutes() < 10){
            minutesFinFormat = "0"+minutesFinFormat;
        }

        // Ajout d'un mois pour affichage
        date.setMonth(date.getMonth()+1);
        // Créer le cours
        newCours = {
            'idEnseignant': idEnseignant,
            'idClasse': $scope.demande.classe,
            'idSalle': $scope.demande.salle,
            'date': date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear(),
            'heureDebut': heureDebutFormat+":"+minutesDebutFormat,
            'heureFin': heureFinFormat+":"+minutesFinFormat,
            'videoProjecteur': $scope.demande.videoProjecteur,
            'dateTmp': $scope.formatDate($scope.demande.date)
        };

        // Voir si un cours n'a pas déjà été reservé dans la salle
        if (!$filter('existeCours')($scope.coursSave, $scope.videoProjecteur)) {
            return;
        }

        // Envoyer les données dans le tableau
        $scope.coursSave.push(newCours);
        /*for(var i=0; i<$scope.coursSave.length; i++) {
         $scope.coursSave[i].dateTmp = undefined;
         }*/
        localStorage.setItem('data', JSON.stringify($scope.coursSave));

        // Détruire cette variable parce que c'est une variable globale pour éviter que d'autres fonctions s'en servent
        delete newCours;
    }
	
	$scope.deletePlanning = function(d) {
       localStorage.removeItem('data');
	   location.reload(); 
    }
	
	$scope.deleteProf = function(d) {
       localStorage.removeItem('enseignants');
	   location.reload(); 
    }
	
	$scope.deleteSalle = function(d) {
       localStorage.removeItem('salles');
	   location.reload(); 
    }
	
	$scope.deleteClasse = function(d) {
       localStorage.removeItem('classes');
	   location.reload(); 
    }
	
    // Ajouter un enseignant
    $scope.newEnseignant = function(d) {        
        var loginEnseignant = $scope.newEnseignant.prenomEnseignant[0].toLowerCase() + $scope.newEnseignant.nomEnseignant.toLowerCase();
        // Vérifier que le login n'existe pas déjà
        if($filter('getEnseignantId')($scope.enseignants, loginEnseignant) != -1) {
            alert("Cet enseignant existe déjà.");
            return;
        }
        $scope.enseignants.push({
            'loginEnseignant':loginEnseignant,
            'prenomEnseignant':$scope.newEnseignant.prenomEnseignant,
            'nomEnseignant':$scope.newEnseignant.nomEnseignant
        });
        localStorage.setItem('enseignants', JSON.stringify($scope.enseignants));
    }
	
	// Ajouter une salle
    $scope.newSalle = function(d) {  
        var numSalle = $scope.newSalle.idSalle;
        // Vérifier que la salle n'existe pas déjà
        if($filter('existeSalle')($scope.salles, numSalle) != -1) {
            alert("Cette salle existe déjà.");
            return;
        }
        $scope.salles.push({
			'effectifSalle':$scope.newSalle.effectifSalle,
			'idSalle':$scope.newSalle.idSalle
        });
        localStorage.setItem('salles', JSON.stringify($scope.salles));
    }
	
	// Ajouter une classe
    $scope.newClasse = function(d) {  
        var nomClasse = $scope.newClasse.nomClasse;
        // Vérifier que la classe n'existe pas déjà
        if($filter('existeClasse')($scope.classe, nomClasse) != -1) {
            alert("Cette classe existe déjà.");
            return;
        }
        $scope.classe.push({
			'nomClasse': $scope.newClasse.nomClasse,
			'effectifClasse': $scope.newClasse.effectifClasse
        });
        localStorage.setItem('classes', JSON.stringify($scope.classe));
    }

    // Obtenir le numéro de la semaine en fonction d'une date
    $scope.getWeekNumber = function(d) {
        // Copier la date pour ne pas modifier l'original
        d = new Date(+d);
        d.setHours(0,0,0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(),0,1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        // Retourner le numéro de semaine
        return weekNo;
    }
}]);

// Directive pour faire apparaitre le trie par professeur ou par classe
app.directive('trieAppear', function ($compile) {
    return function (scope, element, attrs) {
        element.bind("change", function () {
            // Si on sélectionne la case vide, supprimer les anciens tries
            if (scope.trieType == 0) {
                angular.element(document.getElementsByClassName('trie')).remove();
            }
            else {
                // Supprimer les anciens tries
                angular.element(document.getElementsByClassName('trie')).remove();
                var template;
                // Si c'est 1, on a choisi professeur
                if (scope.trieType == 1) {
                    template = "<select data-ng-model='trieIndex' class='trie'><option data-ng-repeat='elt in enseignants' value='{{$index}}'>{{elt.prenomEnseignant}} {{elt.nomEnseignant}}</option></select>";
                }

                // Si c'est 2, on a choisi classe
                else if (scope.trieType == 2) {
                    template = "<select data-ng-model='trieIndex' class='trie'><option data-ng-repeat='elt in classe' value='{{$index}}'>{{elt.nomClasse}}</option></select>";
                }

                // Faire apparaître la nouvelle <select> après la première
                element.parent().append($compile(template)(scope));
            }
        });
    }
});

app.filter('getEnseignantId', function () {
    return function (enseignants, login) {
        for (var i = 0; i < enseignants.length; i++) {
            if (enseignants[i].loginEnseignant == login) {
                return i;
            }
        }
        return -1;
    }
});

app.filter('existeSalle', function () {
    return function (salles, num) {
        for (var i = 0; i < salles.length; i++) {
            if (salles[i].idSalle == num) {
                return i;
            }
        }
        return -1;
    }
});

app.filter('existeClasse', function () {
    return function (classe, nom) {
        for (var i = 0; i < classe.length; i++) {
            if (classe[i].nomClasse === nom) {
                return i;
            }
        }
        return -1;
    }
});

// Retourne true si la salle n'est pas assez grande pour le nombre d'élèves dans la classe
app.filter('problemePlaces', function () {
    return function (salles, effectifClasse) {
        for (var i = 0; i < salles.length; i++) {
            if (effectifClasse > salles[i].effectifSalle) {
                return true;
            }
        }
        return false;
    }
});

app.filter('existeCours', function () {
    return function (oldCours, maxVideoProjecteurs) {
        var numVideoProjecteur = 0;
        var message = "";
        for (var i = 0; i < oldCours.length; i++) {
            oldCours[i].date = new Date(oldCours[i].date);

            if (oldCours[i].heureDebut == newCours.heureDebut && oldCours[i].heureFin == newCours.heureFin && oldCours[i].dateTmp.getTime() == newCours.dateTmp.getTime()) {
                if (oldCours[i].videoProjecteur && newCours.videoProjecteur && numVideoProjecteur < maxVideoProjecteurs) {
                    numVideoProjecteur++;
                    if (numVideoProjecteur >= maxVideoProjecteurs) {
                        message += "Il n'y a plus de vidéo projecteur de diponible.\n";
                        newCours.videoProjecteur = false;
                    }
                }
                if (oldCours[i].idSalle == newCours.idSalle) {
                    alert(message + "La salle est déjà réservée.")
                    return false;
                } else if (oldCours[i].idEnseignant == newCours.idEnseignant) {
                    alert(message + "L'enseignant a déjà cours à cette heure là.")
                    return false;
                } else if (oldCours[i].idClasse == newCours.idClasse) {
                    alert(message + "Cette classe a déjà cours à cette heure là.")
                    return false;
                }
            }
        }
        if (message) alert(message);
        return true;
    }
});