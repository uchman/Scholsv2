'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings','$log', function ($http, $q, localStorageService, ngAuthSettings,$log) {

    var serviceBase = ngAuthSettings.serviceBase;
    var serviceBaseApi = ngAuthSettings.serviceBaseApi;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };
    var _getFeaturedScholarships = function () {
        var deferred = $q.defer();
        var request = $http({
            method: 'GET',
            url: serviceBaseApi + "featured",
        });
        request.success(function (data) {
            $log.log("Featured data retrieved");
            $log.log(data);
            deferred.resolve(data);
        })
            .error(function (error) {
                $log.log(error);
                deferred.reject(error);
            });
        return deferred.promise;
    };

    var _saveRegistration = function (registration) {
        _logOut();
        var deferred = $q.defer();
        $http.post(serviceBaseApi + 'register', registration)
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (err, status) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    var _saveProfile = function (profile) {
        return $http.post(serviceBaseApi + 'saveprofile', profile).then(function (response) {
            return response;
        });
    };
    var _getProfile = function () {
        var deferred = $q.defer();
        $http.get(serviceBaseApi + 'profile')
        .success(function (response) {
            deferred.resolve(response);
        })
        .error(function (err, status) {
            $log.log(err);
            deferred.reject(err);
        });
        //return $http.get(serviceBaseApi + 'account/profile').then(function (response) {
        //    return response;
        //});
        return deferred.promise;
    };
    var _login = function (loginData) {
        $log.log(loginData);
        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $http.post(serviceBaseApi + 'login', loginData)
                    .success(function (response) {

                        if (loginData.useRefreshTokens) {
                            localStorageService.set('authorizationData', { token: response.AccessToken, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                        }
                        else {
                            localStorageService.set('authorizationData', { token: response.AccessToken, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                        }
                        _authentication.isAuth = true;
                        _authentication.userName = response.UserName;
                        _authentication.useRefreshTokens = response.useRefreshTokens;
                        $log.log(response);
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        _logOut();
                        $log.log(err);
                        $log.log(status);
                        deferred.reject(err);
                    });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _getXmlEvents = function () {
        var deferred = $q.defer();
        $http.post(serviceBaseApi + 'getevents')
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (err, status) {
                deferred.reject(err);
            });
        return deferred.promise;
    };
    var _getXmlNews = function () {
        var deferred = $q.defer();
        $http.post(serviceBaseApi + 'getnews')
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (err, status) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.getProfile = _getProfile;
    authServiceFactory.saveProfile = _saveProfile;
    authServiceFactory.getFeaturedScholarships = _getFeaturedScholarships;
    authServiceFactory.getXmlEvents = _getXmlEvents
    authServiceFactory.getXmlNews = _getXmlNews

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);