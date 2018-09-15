'use strict';

angular.module('myApp.scoreField', ['ngRoute', 'myApp.config'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/scoreField', {
            templateUrl: 'modules/scoreEngine/scoreFieldTemplate.html',
            controller: 'ScoreFieldCtrl'
        });
    }])

    .controller('ScoreFieldCtrl', ['GENERAL_CONFIG', 'ScoreFieldService', '$scope', function (GENERAL_CONFIG, ScoreFieldService, $scope) {

        $scope.pageData = {
            categoryList: [],
            borrowerTypeList: [],
            category: "",
            fieldName: "",
            fieldDesc: "",
            applyScore: false,
            maxScore: 0,
            borrowerType: "",
            partner: {}
        }

        $scope.initScoreField = function () {
            $scope.pageData.categoryList = ScoreFieldService.loadCategory();
            $scope.pageData.borrowerTypeList = ScoreFieldService.loadBorrowerType();
            $scope.pageData.partnerList = ScoreFieldService.loadPartners();

            for (var i = 0; i < $scope.pageData.partnerList.length; i++) {
                if ($scope.pageData.partnerList[i].partnerId == $scope.pageData.partner.partnerId) {
                    $scope.pageData.partner = $scope.pageData.partnerList[i];
                    console.log("Partner: " + JSON.stringify($scope.pageData.partner));
                }
            }
        };

    }])

    .service('ScoreFieldService', ['GENERAL_CONFIG', '$http', function (GENERAL_CONFIG, $http) {

        this.loadCategory = function () {
            var categoryList = GENERAL_CONFIG.categoryList;
            return categoryList;
        };

        this.loadBorrowerType = function () {
            var borrowerTypeList = GENERAL_CONFIG.borrowerTypeList;
            return borrowerTypeList;
        };

        this.loadPartners = function () {

            var url = GENERAL_CONFIG.LALALENDS_URL + "partner/reteriveAll";
            // var url = "http://13.232.226.25:8080/lalalends/scoreEngine/checkValidation";

            /*var data = $.param({
                fName: $scope.firstName,
                lName: $scope.lastName
            });*/

            var data = {};

            var config = {
                headers: {
                    // 'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Accept': "application/json",
                    // "Access-Control-Allow-Origin-Methods":"GET, POST, OPTIONS,PUT, DELETE",
                    // "Access-Control-Allow-Origin": "*",
                    // "Access-Control-Allow-Headers":"Content-Type, Accept, X-Requested-With, remember-me"
                }
            }
            /*$http({
                method: "POST",
                url: url,
                data: {},
                headers: { "Content-Type": "application/json","Access-Control-Allow-Origin": "*" }
            })*/

            $http.post(url, data,config)
                .success(function(data, status, headers, config) {
                    console.log("data: "+JSON.stringify(data));
                });
               /* .error(function (data, status, header, config) {
                });*/
/*
            axios.post(url, {
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });*/


        };

        this.createScoreField = function () {

            return true;
        };

    }]);