var app = angular.module("app", []);

app.controller("Controleur", ["$scope", "$filter", function ($scope, $filter) {
	// le code du contrôleur
	$scope.salles=[100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
	$scope.enseignants=[{'loginEnseignant':'gchagnon', 'prenomEnseignant':'Gilles','nomEnseignant':'Chagnon'}, {'loginEnseignant':'pnollet', 'prenomEnseignant':'Patrick','nomEnseignant':'Nollet'}, {'loginEnseignant':'fhollande', 'prenomEnseignant':'François','nomEnseignant':'Hollande'}, {'loginEnseignant':'mlisa', 'prenomEnseignant':'Mona','nomEnseignant':'Lisa'}];
	$scope.classe=[{'nomClasse':'Licence professionnelle Projet Web','effectifClasse': 25}, {'nomClasse':'Licence professionnelle ','effectifClasse': 30}, {'nomClasse':'Licence Physique','effectifClasse': 28}];
	$scope.cours=[{'idEnseignant':0, 'idClasse':0, 'idSalle':100, 'date':'2016-01-23', 'heureDebut':8, 'heureFin':9}];

	$scope.ajout = function () {
		console.log($filter('getEnseignantId')($scope.enseignants, $scope.demande.enseignant));
		$scope.cours.push({});
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