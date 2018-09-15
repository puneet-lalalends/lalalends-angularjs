'use strict';

var config_module = angular.module('myApp.config', []);

var config_data = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'LALALANDS',
        'APP_VERSION': '0.1',
        'LALALENDS_URL': 'http://localhost:8080/',
        'categoryList':['Loan Requirement','Application Details','Occupation Details','Co-Applicant'],
        'borrowerTypeList':['Individual','Business','All']
    }
};

angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
});