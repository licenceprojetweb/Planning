var app = angular.module("app", []);

app.controller("Controleur", ["$scope", "$http", "$filter", function ($scope, $http, $filter) {

    // Le code du contrôleur
    //localStorage.clear();
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
    console.log(localStorage.getItem('data'));
    $scope.videoProjecteur = 3;
    $scope.salles = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
    $scope.enseignants = [{
        'loginEnseignant': 'gchagnon',
        'prenomEnseignant': 'Gilles',
        'nomEnseignant': 'Chagnon'
    }, {
        'loginEnseignant': 'pnollet',
        'prenomEnseignant': 'Patrick',
        'nomEnseignant': 'Nollet'
    }, {
        'loginEnseignant': 'fhollande',
        'prenomEnseignant': 'François',
        'nomEnseignant': 'Hollande'
    }, {
        'loginEnseignant': 'mlisa',
        'prenomEnseignant': 'Mona',
        'nomEnseignant': 'Lisa'
    }];

    $scope.classe = [{
        'nomClasse': 'Licence professionnelle Projet Web',
        'effectifClasse': 25
    }, {
        'nomClasse': 'Licence professionnelle ',
        'effectifClasse': 30
    }, {
        'nomClasse': 'Licence Physique',
        'effectifClasse': 28
    }, {
        'nomClasse': 'BTS SIO',
        'effectifClasse': 18
    }];

    /*$scope.cours = [{
     'idEnseignant': 0,
     'idClasse': 0,
     'idSalle': 100,
     'heureDebut': 8,
     'heureFin': 9,
     'videoProjecteur': 1
     }];*/

    $scope.ajout = function () {
        var idEnseignant = $filter('getEnseignantId')($scope.enseignants, $scope.demande.enseignant);

        // Si il manque des champs, arrêter la fonction ici
        if (idEnseignant <= -1) {
            alert("Le login de l'enseignant n'est pas valide.");
            return;
        }
        if (!$scope.demande.salle || !$filter('existeSalle')($scope.salles, $scope.demande.salle)) {
            alert("La salle que vous avez entré n'existe pas.");
            return;
        }
        if (!$scope.demande.classe || !$scope.demande.date || !$scope.demande.heureDebut || !$scope.demande.heureFin) {
            return;
        }
        if ($scope.demande.heureDebut.getTime() == $scope.demande.heureFin.getTime()) {
            alert("Les heures doivent être différentes.")
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

        date = new Date($scope.demande.date);
        heureDebut = new Date ($scope.demande.heureDebut);
        heureFin = new Date ($scope.demande.heureFin);

        if (heureDebut.getHours() < 10) {
            heureDebutFormat = "0"+heureDebut.getHours();
        }

        if (heureDebut.getMinutes() < 10){
            minutesDebutFormat = "0"+heureDebut.getMinutes();
        }


        if (heureFin.getHours() < 10) {
            heureFinFormat = "0"+heureFin.getHours();
        }

        if (heureFin.getMinutes() < 10){
            minutesFinFormat = "0"+heureFin.getMinutes();
        }

        // Créer le cours
        newCours = {
            'idEnseignant': idEnseignant,
            'idClasse': $scope.demande.classe,
            'idSalle': $scope.demande.salle,
            'date': date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear(),
            'heureDebut': heureDebutFormat+":"+minutesDebutFormat,
            'heureFin': heureFinFormat+":"+minutesFinFormat,
            'videoProjecteur': $scope.demande.videoProjecteur
        };

        // Voir si un cours n'a pas déjà été reservé dans la salle
        if (!$filter('existeCours')($scope.coursSave, $scope.videoProjecteur)) {
            return;
        }

        // Envoyer les données dans le tableau
        $scope.coursSave.push(newCours);
        localStorage.setItem('data', JSON.stringify($scope.coursSave));
        console.log(localStorage.getItem('data'));

        // Détruire cette variable parce que c'est une variable globale pour éviter que d'autres fonctions s'en servent
        delete newCours;
    }
}]);

app.directive('trieAppear', function ($compile) {
    return function (scope, element, attrs) {
        element.bind("change", function () {
            if (scope.trieType) {
                angular.element(document.getElementById('trie')).append($compile("<select><option>test</option></select>")(scope));
            }
        });
    };
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
            if (salles[i] == num) {
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
        console.log(oldCours.length);
        for (var i = 0; i < oldCours.length; i++) {
            console.log(oldCours[i].heureDebut);
            if (oldCours[i].heureDebut == newCours.heureDebut && oldCours[i].heureFin == newCours.heureFin) {
                if (oldCours[i].videoProjecteur && newCours.videoProjecteur && numVideoProjecteur < maxVideoProjecteurs) {
                    numVideoProjecteur++;
                    if (numVideoProjecteur >= maxVideoProjecteurs) {
                        message += "Le vidéo projecteur est déjà pris.\n";
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