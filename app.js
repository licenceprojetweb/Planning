var app = angular.module("app", []);

app.controller("Controleur", ["$scope", "$filter", function ($scope, $filter) {
	
	// Le code du contrôleur
	$scope.salles=[100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
	$scope.enseignants=[{'loginEnseignant':'gchagnon', 'prenomEnseignant':'Gilles','nomEnseignant':'Chagnon'}, {'loginEnseignant':'pnollet', 'prenomEnseignant':'Patrick','nomEnseignant':'Nollet'}, {'loginEnseignant':'fhollande', 'prenomEnseignant':'François','nomEnseignant':'Hollande'}, {'loginEnseignant':'mlisa', 'prenomEnseignant':'Mona','nomEnseignant':'Lisa'}];
	$scope.classe=[{'nomClasse':'Licence professionnelle Projet Web','effectifClasse': 25}, {'nomClasse':'Licence professionnelle ','effectifClasse': 30}, {'nomClasse':'Licence Physique','effectifClasse': 28}];
	$scope.cours=[{'idEnseignant':0, 'idClasse':0, 'idSalle':100, 'heureDebut':8, 'heureFin':9, 'videoProjecteur':1}];

	// Mettre le select de salle à une valeur par défaut
	//$scope.demande = {'classe':$scope.classe[0].nomClasse};
	
	$scope.ajout = function () {
		console.log($filter('getEnseignantId')($scope.enseignants, $scope.demande.enseignant));
		console.log($scope.demande.classe);
		
		var idEnseignant = $filter('getEnseignantId')($scope.enseignants, $scope.demande.enseignant);
		
		// Si il manque des champs, arrêter la fonction ici
		if(idEnseignant <= -1 || !$scope.demande.date || !$scope.demande.heureDebut || !$scope.demande.heureFin) {
			return;
		}
		
		// Formater la date dans les champs heureDebut et heureFin
		$scope.demande.heureDebut.setDate($scope.demande.date.getDate());
		$scope.demande.heureDebut.setMonth($scope.demande.date.getMonth());
		$scope.demande.heureDebut.setFullYear($scope.demande.date.getFullYear());
		$scope.demande.heureFin.setDate($scope.demande.date.getDate());
		$scope.demande.heureFin.setMonth($scope.demande.date.getMonth());
		$scope.demande.heureFin.setFullYear($scope.demande.date.getFullYear());
		
		// Envoyer les données dans le tableau
		$scope.cours.push({
			'idEnseignant': idEnseignant,
			'idClasse':$scope.demande.classe,
			'idSalle':$scope.demande.salle,
			'heureDebut':$scope.demande.heureDebut,
			'heureFin':$scope.demande.heureFin,
			'videoProjecteur':$scope.demande.videoProjecteur,
		});
		//$scope.livres.push({'datePublication':$scope.chpanneepubli, 'nomAuteur':$scope.chpnom, 'prenomAuteur':$scope.chpprenom, 'titre':$scope.chptitre});
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