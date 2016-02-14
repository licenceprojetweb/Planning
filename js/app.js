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

    // Mettre la date du jour pour voir l'emploi du temps du jour
    $scope.trieDate = new Date("2016-01-01");

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

        console.log($scope.demande.heureDebut);

        var date = new Date($scope.demande.date);
        var heureDebut = new Date ($scope.demande.heureDebut);
        var heureFin = new Date ($scope.demande.heureFin);

        console.log(heureDebut.getHours());
        console.log(heureFin.getHours());
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

        // Créer le cours
        newCours = {
            'idEnseignant': idEnseignant,
            'idClasse': $scope.demande.classe,
            'idSalle': $scope.demande.salle,
            'date': date.getDate()+"/"+parseInt(date.getMonth()+1)+"/"+date.getFullYear(),
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
        for(var i=0; i<$scope.coursSave.length; i++) {
            $scope.coursSave[i].dateTmp = undefined;
        }
        localStorage.setItem('data', JSON.stringify($scope.coursSave));
        console.log(localStorage.getItem('data'));

        // Détruire cette variable parce que c'est une variable globale pour éviter que d'autres fonctions s'en servent
        delete newCours;
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