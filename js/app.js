var app = angular.module("app", []);

app.controller("Controleur", ["$scope", "$filter", function ($scope, $filter) {
	
	// Le code du contrôleur
	$scope.videoProjecteur = 3;
	$scope.salles=[100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
	$scope.enseignants=[{'loginEnseignant':'gchagnon', 'prenomEnseignant':'Gilles','nomEnseignant':'Chagnon'}, {'loginEnseignant':'pnollet', 'prenomEnseignant':'Patrick','nomEnseignant':'Nollet'}, {'loginEnseignant':'fhollande', 'prenomEnseignant':'François','nomEnseignant':'Hollande'}, {'loginEnseignant':'mlisa', 'prenomEnseignant':'Mona','nomEnseignant':'Lisa'}];
	$scope.classe=[{'nomClasse':'Licence professionnelle Projet Web','effectifClasse': 25}, {'nomClasse':'Licence professionnelle ','effectifClasse': 30}, {'nomClasse':'Licence Physique','effectifClasse': 28}, {'nomClasse':'BTS SIO','effectifClasse': 18}];
	$scope.cours=[{'idEnseignant':0, 'idClasse':0, 'idSalle':100, 'heureDebut':8, 'heureFin':9, 'videoProjecteur':1}];
	
	$scope.ajout = function () {
		
		var idEnseignant = $filter('getEnseignantId')($scope.enseignants, $scope.demande.enseignant);
		
		// Si il manque des champs, arrêter la fonction ici
		if(idEnseignant <= -1) {
			alert("Le login de l'enseignant n'est pas valide.");
			return;
		}
		if(!$scope.demande.salle || !$filter('existeSalle')($scope.salles, $scope.demande.salle)) {
			alert("La salle que vous avez entré n'existe pas.");
			return;
		}
		if(!$scope.demande.classe || !$scope.demande.date || !$scope.demande.heureDebut || !$scope.demande.heureFin) {
			return;
		}
		if($scope.demande.heureDebut.getTime() == $scope.demande.heureFin.getTime()) {
			alert("Les heures doivent être différentes.")
			return;
		}
		
		// Formater la date dans les champs heureDebut et heureFin
		$scope.demande.heureDebut.setDate($scope.demande.date.getDate());
		$scope.demande.heureDebut.setMonth($scope.demande.date.getMonth());
		$scope.demande.heureDebut.setFullYear($scope.demande.date.getFullYear());
		$scope.demande.heureFin.setDate($scope.demande.date.getDate());
		$scope.demande.heureFin.setMonth($scope.demande.date.getMonth());
		$scope.demande.heureFin.setFullYear($scope.demande.date.getFullYear());
		
		// Créer le cours
		cours = {
			'idEnseignant': idEnseignant,
			'idClasse':$scope.demande.classe,
			'idSalle':$scope.demande.salle,
			'heureDebut':$scope.demande.heureDebut,
			'heureFin':$scope.demande.heureFin,
			'videoProjecteur':$scope.demande.videoProjecteur,
		}
		
		// Voir si un cours n'a pas déjà été reservé dans la salle
		if(!$filter('existeCours')($scope.cours, $scope.videoProjecteur)) {
			return;
		}
		
		// Envoyer les données dans le tableau
		$scope.cours.push(cours);

		// Détruire cette variable parce que c'est une variable globale pour éviter que d'autres fonctions s'en servent
		delete cours;
	}
}]);

app.filter('getEnseignantId', function() {
  return function(enseignants, login) {
    for (var i=0; i<enseignants.length; i++) {
      if (enseignants[i].loginEnseignant == login) {
        return i;
      }
    }
    return -1;
  }
});

app.filter('existeSalle', function() {
  return function(salles, num) {
    for (var i=0; i<salles.length; i++) {
      if (salles[i] == num) {
        return true;
      }
    }
    return false;
  }
});

app.filter('existeCours', function() {
  return function(reservations, maxVideoProjecteurs) {
  	var numVideoProjecteur = 0;
  	var message = "";
    for (var i=0; i<reservations.length; i++) {
      if (reservations[i].heureDebut == cours.heureDebut && reservations[i].heureFin == cours.heureFin) {
      	if(reservations[i].videoProjecteur && cours.videoProjecteur && numVideoProjecteur < maxVideoProjecteurs) {
      		numVideoProjecteur++;
      		if(numVideoProjecteur >= maxVideoProjecteurs) {
      			message += "Le vidéo projecteur est déjà pris.\n";
      			cours.videoProjecteur = false;
      		}
      	}
		if(reservations[i].idSalle == cours.idSalle) {
			alert(message + "La salle est déjà réservée.")
			return false;
		}
		else if(reservations[i].idEnseignant == cours.idEnseignant) {
			alert(message + "L'enseignant a déjà cours à cette heure là.")
			return false;
		}
		else if(reservations[i].idClasse == cours.idClasse) {
			alert(message + "Cette classe a déjà cours à cette heure là.")
			return false;
		}
      }
    }
    if(message) alert(message);
    return true;
  }
});