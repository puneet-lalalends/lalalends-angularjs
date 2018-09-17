'use strict';
angular.module('myApp.scoreField', ['ngRoute', 'myApp.config','ngToast'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/scoreField', {
            templateUrl: 'modules/scoreEngine/scoreFieldTemplate.html',
            controller: 'ScoreFieldCtrl'
        });
    }])

    .controller('ScoreFieldCtrl', ['GENERAL_CONFIG', 'ScoreFieldService', '$scope','ngToast', function (GENERAL_CONFIG, ScoreFieldService, $scope,ngToast) {

        $scope.pageData = {
            categoryList: [],
            borrowerTypeList: [],
            partnerList:[],
            scoreFieldList:[],
            partner:{}
        };

        $scope.addScoreField = function(){
            var scoreField = {category: {value:"",readOnly:false},
                fieldName: {value:"",readOnly:false},
                fieldDesc: {value:"",readOnly:false},
                jsonParam: {value:"",readOnly:false},
                applyScore: {value:false,readOnly:false},
                maxScore: {value:0,readOnly:false},
                borrowerType: {value:"",readOnly:false},
                partner: $scope.pageData.partnerList[0],
                scoreRulesSet:[]
            };
            $scope.pageData.scoreFieldList.push(scoreField);
        };

        $scope.initScoreField = function () {
            $scope.pageData.categoryList = ScoreFieldService.loadCategory();
            $scope.pageData.borrowerTypeList = ScoreFieldService.loadBorrowerType();

            $scope.loadPartners();
            $scope.loadScoreField();

        };

        $scope.loadPartners = function(){
            var partnersPromise = ScoreFieldService.loadPartners();
            partnersPromise.then(
                function(answer) {
                    $scope.pageData.partnerList = answer.payload;
                    $scope.pageData.partner = $scope.pageData.partnerList[0];
                },
                function(error) {},
                function(progress) {});
        };

        $scope.loadScoreField = function(){
            $scope.pageData.scoreFieldList = [];
            var scoreFieldPromise = ScoreFieldService.loadScoreField();
            scoreFieldPromise.then(
                function(answer) {

                    if(answer.payload != null && answer.payload != undefined && answer.payload.length > 0){

                        for(var i = 0 ; i < answer.payload.length ; i++){
                            $scope.pageData.scoreFieldList.push($scope.convertServerObjToPageObj(answer.payload[i]));
                        }
                    }
                },
                function(error) {},
                function(progress) {});
        };

        $scope.deleteScoreField = function(index){
            var scoreField = $scope.pageData.scoreFieldList[index];
            var scoreFieldServerObj = $scope.convertPageObjToServerObj(scoreField);

            var promise = ScoreFieldService.deleteScoreField(scoreFieldServerObj);
            promise.then(
                function(answer) {
                    ngToast.create('A score field successfully deleted');
                    $scope.loadScoreField();
                },
                function(error) {},
                function(progress) {});
        };

        $scope.saveScoreField = function (index) {
            var scoreField = $scope.pageData.scoreFieldList[index];
            var scoreFieldServerObj = $scope.convertPageObjToServerObj(scoreField);

            var promise = ScoreFieldService.createScoreField(scoreFieldServerObj);
            promise.then(
                function(answer) {
                    ngToast.create('A score field successfully saved');
                    $scope.pageData.scoreFieldList[index] = $scope.convertServerObjToPageObj(answer.payload);
                },
                function(error) {},
                function(progress) {});
        };

        $scope.editScoreField = function(index){
            var scoreField = $scope.pageData.scoreFieldList[index];

            scoreField.category.readOnly = false;
            scoreField.fieldName.readOnly = false;
            scoreField.fieldDesc.readOnly = false;
            scoreField.applyScore.readOnly = false;
            scoreField.maxScore.readOnly = false;
            scoreField.borrowerType.readOnly = false;
            scoreField.jsonParam.readOnly = false;
        };

        $scope.updateScoreField = function (index) {
            var scoreField = $scope.pageData.scoreFieldList[index];
            var scoreFieldServerObj = $scope.convertPageObjToServerObj(scoreField);

            var promise = ScoreFieldService.updateScoreField(scoreFieldServerObj);
            promise.then(
                function(answer) {
                    ngToast.create('A score field successfully updated');

                    scoreField.category.readOnly = true;
                    scoreField.fieldName.readOnly = true;
                    scoreField.fieldDesc.readOnly = true;
                    scoreField.applyScore.readOnly = true;
                    scoreField.maxScore.readOnly = true;
                    scoreField.borrowerType.readOnly = true;
                    scoreField.jsonParam.readOnly = true;
                },
                function(error) {},
                function(progress) {});
        };

        $scope.convertPageObjToServerObj = function (pageObj) {

            var serverObj = {};

            if(pageObj.scoreId != null && pageObj.scoreId != undefined){
                serverObj.scoreId = pageObj.scoreId;
            }
            serverObj.scoreCategory = pageObj.category.value;
            serverObj.scoreFieldName = pageObj.fieldName.value;
            serverObj.scoreFieldDesc = pageObj.fieldDesc.value;
            serverObj.scoreIsScoreApplicable = pageObj.applyScore.value?1:0;
            serverObj.maxscore = pageObj.maxScore.value;
            serverObj.scoreBorrowerType = pageObj.borrowerType.value;
            serverObj.scoreJsonFieldName = pageObj.jsonParam.value;
            serverObj.partner = pageObj.partner;
            serverObj.scoreRulesSet = [];

            return serverObj;
        };

        $scope.convertServerObjToPageObj = function (serverObj) {

            var pageObj = {};

            pageObj.scoreId = serverObj.scoreId;
            pageObj.category = {value:serverObj.scoreCategory,readOnly:true};
            pageObj.fieldName = {value:serverObj.scoreFieldName,readOnly:true};
            pageObj.fieldDesc = {value:serverObj.scoreFieldDesc,readOnly:true};
            pageObj.applyScore = {value:serverObj.scoreIsScoreApplicable==1?true:false,readOnly:true};
            pageObj.maxScore = {value:serverObj.maxscore,readOnly:true};
            pageObj.borrowerType = {value:serverObj.scoreBorrowerType,readOnly:true};
            pageObj.jsonParam = {value:serverObj.scoreJsonFieldName,readOnly:true};
            pageObj.partner = serverObj.partner;

            if(serverObj.scoreRulesSet != null && serverObj.scoreRulesSet != undefined && serverObj.scoreRulesSet.length > 0){

            }else{
                pageObj.scoreRulesSet = [];
            }

            return pageObj;
        };

    }])

    .service('ScoreFieldService', ['GENERAL_CONFIG', '$http', '$q', function (GENERAL_CONFIG, $http, $q) {

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

            /*$http.post(url, data, config)
                .success(function (data, status, headers, config) {
                    console.log("data: " + JSON.stringify(data));
                })
                .error(function (data, status, header, config) {
                });*/

            var deferred = $q.defer();

            var promise = $http.post(url, data, config);
            promise.then(
                function(payload) {
                    deferred.resolve({payload:payload.data});
                },function(errorPayload) {
                    deferred.resolve({errorPayload:errorPayload.data});
                });

            return deferred.promise;
        };

        this.createScoreField = function (dataParam) {

            var url = GENERAL_CONFIG.LALALENDS_URL + "scoreFieldsV2/save";
            var data = dataParam;
            var config = {headers: {}};

            var deferred = $q.defer();
            var promise = $http.post(url, data, config);
            promise.then(
                function(payload) {
                    deferred.resolve({payload:payload.data});
                },function(errorPayload) {
                    deferred.resolve({errorPayload:errorPayload.data});
                });

            return deferred.promise;
        };

        this.updateScoreField = function (dataParam) {

            var url = GENERAL_CONFIG.LALALENDS_URL + "scoreFieldsV2/update";
            var data = dataParam;
            var config = {headers: {}};

            var deferred = $q.defer();
            var promise = $http.post(url, data, config);
            promise.then(
                function(payload) {
                    deferred.resolve({payload:payload.data});
                },function(errorPayload) {
                    deferred.resolve({errorPayload:errorPayload.data});
                });

            return deferred.promise;
        };

        this.deleteScoreField = function (dataParam) {

            var url = GENERAL_CONFIG.LALALENDS_URL + "scoreFieldsV2/delete";
            var data = dataParam;
            var config = {headers: {}};

            var deferred = $q.defer();
            var promise = $http.post(url, data, config);
            promise.then(
                function(payload) {
                    deferred.resolve({payload:payload.data});
                },function(errorPayload) {
                    deferred.resolve({errorPayload:errorPayload.data});
                });

            return deferred.promise;
        };

        this.loadScoreField = function () {

            var url = GENERAL_CONFIG.LALALENDS_URL + "scoreFieldsV2/reteriveAll";
            var data = {};
            var config = {headers: {}};

            var deferred = $q.defer();
            var promise = $http.post(url, data, config);
            promise.then(
                function(payload) {
                    deferred.resolve({payload:payload.data});
                },function(errorPayload) {
                    deferred.resolve({errorPayload:errorPayload.data});
                });

            return deferred.promise;
        };

    }]).filter('checkEditMode',function () {

        return function (input) {

            var result = false;

            if(input.category.readOnly && input.fieldName.readOnly && input.fieldDesc.readOnly && input.jsonParam.readOnly && input.applyScore.readOnly && input.maxScore.readOnly && input.borrowerType.readOnly){
                result = true;
            }
            return result;
        };
});