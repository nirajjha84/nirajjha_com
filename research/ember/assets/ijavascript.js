"use strict";



define('ijavascript/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.default = _emberData.default.JSONAPIAdapter.extend({});
});
define('ijavascript/adapters/authenticate', ['exports', 'ijavascript/adapters/application'], function (exports, _application) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend({
        namespace: 'api'
    });
});
define('ijavascript/app', ['exports', 'ijavascript/resolver', 'ember-load-initializers', 'ijavascript/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('ijavascript/components/orange-box', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        /**
         @property {boolean} isOrange used as flag to toggle class name
        */
        isOrange: true,

        actions: {
            /**
             * @method [actions.toggleColor]
             * Method toggle @property isOrange to true || false
             * Value change reflects in the handlebar helper as class name change 
            */
            toggleColor: function toggleColor() {
                this.toggleProperty('isOrange');
            }
        }

    });
});
define('ijavascript/components/team-members', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        willRender: function willRender() {
            var _this = this;

            Ember.$.getJSON('/stub/team.json').then(function (data) {
                _this.set('team', data);
            });
        }
    });
});
define('ijavascript/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('ijavascript/controllers/about', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('ijavascript/controllers/dashboard', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        /**
         * @method [init]
         * init method to get user data from API
        */
        init: function init() {
            this._super.apply(this, arguments);

            this.retrieveUserDetails();
        },

        /**
         * @method [retrieveUserDetails]
         * Method will connect to RetrieveUserDetails API
         * API will have all user specific data which will be used to show data on dashboard screen
        */
        retrieveUserDetails: function retrieveUserDetails() {
            var me = this;

            // TODO - use ember data and adapters to consume this
            Ember.$.ajax({
                data: { customerid: 'IJ101' },
                method: 'POST',
                url: '/stub/RetrieveUserDetails.json'
            }).then(function (response) {
                if (response.success) {
                    me.set('customer', response.customer);
                } else {
                    alert('Retrieve User Details API - SUCCESS False');
                }
            })
            // check API errors
            .catch(function () {
                alert('Retrieve User Details API Exeption');
            });
        },

        actions: {
            checkSubscription: function checkSubscription(sms, newsletter, flyer) {
                //TODO - this method need re-factor
                //TODO - get all data from Form as single object
                var isSMS = sms ? 'Yes' : 'No',
                    isNewsletter = newsletter ? 'Yes' : 'No',
                    isFlyer = flyer ? 'Yes' : 'No';

                alert('User selection - SMS: ' + isSMS + ', Newsletter: ' + isNewsletter + ', Flyer: ' + isFlyer + '');
            }
        }
    });
});
define('ijavascript/controllers/login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        /**
         @property {String} errorMessage used to show top level error
        */
        errorMessage: null,

        actions: {
            /**
             @method [actions.onLoginSubmit]
            */
            onLoginSubmit: function onLoginSubmit() {
                var userid = this.get('userid'),
                    password = this.get('password');

                // validate form
                // if form fields are empty then it will provide value to top level error property
                if (!userid || !password) {
                    this.setProperties({
                        'errorMessage': 'Please enter login credentials to continue'
                    });
                    return;
                } else {
                    // prepare request
                    var request = {
                        "client_id": "iJavaScript",
                        "user": {
                            "id": userid,
                            "password": password
                        }
                    };
                    // call api
                    this.callAuthenticateUser(request);
                }
            }

        },

        /**
         * @method [callAuthenticateUser]
         * Method will call Authenticate User API
         * It will call methods to authenticate user based on response and also
         * to handle exception
         * @param request request data for api connection
         * 
         * TODO - user ember data here
        */
        callAuthenticateUser: function callAuthenticateUser(request) {
            var me = this;
            // connect to store for AuthenticateUser API
            //this.store.findRecord('authenticate', 1).then(function(success, response) {
            //this.transitionToRoute('authenticate').then(function(success, response) {
            Ember.$.ajax({
                data: JSON.stringify(request),
                method: 'POST',
                contentType: "application/json",
                url: '/stub/AuthenticateUser.json'
            }).then(function (response) {
                if (response.success) {
                    me.validateUser(response);
                } else {
                    me.showApiException();
                }
            })
            // check API errors
            .catch(function () {
                me.showApiException();
            });
        },

        /**
         * @method [validateUser]
         * Method will get response from AuthenticateUser Api
         * It will validate user based on response node isUserAuthenticated
         * if isUserAuthenticated = TRUE it will start dashboard route else
         * it will set value for top level error
         * @param response
        */
        validateUser: function validateUser(response) {
            // check response
            // if authenticated then re-direct to dashboard page
            if (response.isUserAuthenticated) {
                this.transitionToRoute('dashboard');
            } else {
                // show top level error incase not authenticated
                this.setProperties({
                    'errorMessage': 'Invalid User Credentials!'
                });
            }
        },

        /**
         * @method [showApiException]
         * Method will get called from onLoginSubmit action method when
         * AutheticateUser api will get technical issue to connect or api connection status will be 200
         * but api will return success as FALSE due to  internal technical exceptions
        */
        showApiException: function showApiException() {
            this.setProperties({
                'errorMessage': 'Sorry, unable to connect to system!'
            });
        }

    });
});
define('ijavascript/controllers/team', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({});
});
define('ijavascript/helpers/app-version', ['exports', 'ijavascript/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('ijavascript/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('ijavascript/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('ijavascript/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ijavascript/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('ijavascript/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('ijavascript/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ijavascript/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('ijavascript/initializers/export-application-global', ['exports', 'ijavascript/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('ijavascript/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ijavascript/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('ijavascript/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("ijavascript/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('ijavascript/models/authenticate', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        // get current date and time
        createdAt: _emberData.default.attr('date', {
            defaultValue: function defaultValue() {
                return new Date();
            }
        }),
        client_id: _emberData.default.attr('string'),
        user: _emberData.default.belongsTo('user')
    });
});
define('ijavascript/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userid: _emberData.default.attr('string'),
        password: _emberData.default.attr('string')
    });
});
define('ijavascript/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('ijavascript/router', ['exports', 'ijavascript/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('login');
    this.route('dashboard');
    this.route('about');
    this.route('team');
    this.route('authenticate');
    this.route('fourohfour', { path: "*path" });
  });

  exports.default = Router;
});
define('ijavascript/routes/about', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ijavascript/routes/application', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            this.transitionTo('login');
        }
    });
});
define('ijavascript/routes/authenticate', ['exports'], function (exports) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.default = Ember.Route.extend({});
});
define('ijavascript/routes/dashboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ijavascript/routes/four-oh-four', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ijavascript/routes/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ijavascript/routes/team', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('ijavascript/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("ijavascript/templates/about", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "s4j8rozk", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[2,\" left section \"],[0,\"\\n    \"],[1,[18,\"nav-panel\"],false],[0,\"\\n\\n\\n    \"],[2,\" right section \"],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"float-right grey-box right-panel\"],[7],[0,\"\\n        \"],[6,\"h2\"],[7],[0,\"About iJavaScript\"],[8],[0,\"\\n\\n        \"],[6,\"hr\"],[7],[8],[0,\"\\n\\n        \"],[6,\"div\"],[7],[0,\" \\n            \\n            \"],[6,\"img\"],[9,\"src\",\"assets/images/user_img.png\"],[9,\"align\",\"left\"],[9,\"class\",\"mrgn-rgt20\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"iJavaScript is a research group, founded to check different javascript frameworks based on different design patterns.\"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"This use case will prove different aspects of framework capabilities.\"],[8],[0,\"\\n    \\n        \"],[8],[0,\"\\n\\n        \"],[6,\"h4\"],[9,\"style\",\"margin-top:50px\"],[7],[0,\"Re-usable Component\"],[8],[0,\"\\n        \"],[1,[18,\"orange-box\"],false],[0,\"\\n        \"],[1,[18,\"orange-box\"],false],[0,\"\\n\\n        \\n    \"],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/about.hbs" } });
});
define("ijavascript/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gN5UaiYX", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n\\n    \"],[2,\" header \"],[0,\"\\n    \"],[6,\"div\"],[9,\"id\",\"login-header\"],[9,\"class\",\"red-box\"],[7],[0,\"\\n        \"],[6,\"h1\"],[7],[0,\"\\n            \"],[6,\"span\"],[7],[0,\"Ember JS\"],[8],[0,\"\\n            iJavaScript\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[2,\" Route pages \"],[0,\"\\n    \"],[1,[18,\"outlet\"],false],[0,\"\\n\\n    \"],[2,\"footer \"],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"footer\"],[7],[0,\"Application Developed by Niraj Jha\"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/application.hbs" } });
});
define("ijavascript/templates/authenticate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DC8yoAR6", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/authenticate.hbs" } });
});
define("ijavascript/templates/components/login-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lE82hNUc", "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/components/login-form.hbs" } });
});
define("ijavascript/templates/components/nav-panel", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nPMA3yLZ", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"float-left grey-box left-panel\"],[7],[0,\"\\n    \"],[6,\"ul\"],[9,\"class\",\"left-nav\"],[7],[0,\"\\n        \"],[6,\"li\"],[7],[4,\"link-to\",[\"dashboard\"],null,{\"statements\":[[0,\"Dashboard \"]],\"parameters\":[]},null],[8],[0,\"\\n        \"],[6,\"li\"],[7],[4,\"link-to\",[\"about\"],null,{\"statements\":[[0,\" About \"]],\"parameters\":[]},null],[8],[0,\"\\n        \"],[6,\"li\"],[7],[4,\"link-to\",[\"team\"],null,{\"statements\":[[0,\" Team \"]],\"parameters\":[]},null],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/components/nav-panel.hbs" } });
});
define("ijavascript/templates/components/orange-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "x/w1RWGM", "block": "{\"symbols\":[\"&default\"],\"statements\":[[2,\"\\nre-usable component.\\n\\nuse as {{orange-box}} inside other handlebars.\\n\\nit will appear as orange box.\\nif user clicks on the box, box will toggle color to red and orange\\n\"],[0,\"\\n\\n\"],[11,1],[0,\"\\n\\n\"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[20,[\"isOrange\"]],\"orange-box\",\"redcolor-box\"],null]]]],[3,\"action\",[[19,0,[]],\"toggleColor\"]],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/components/orange-box.hbs" } });
});
define("ijavascript/templates/components/team-members", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "oo6ZAnUf", "block": "{\"symbols\":[\"member\",\"&default\"],\"statements\":[[2,\"\\nre-usable component.\\n\\nuse as {{team-members}} inside other handlebars.\\n\\nit will populate list of team members data from a local json file\\n\"],[0,\"\\n\\n\"],[11,2],[0,\"\\n\\n\"],[6,\"ul\"],[9,\"class\",\"team\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"team\",\"members\"]]],null,{\"statements\":[[0,\"\\n    \"],[6,\"li\"],[7],[0,\"\\n        \"],[6,\"img\"],[10,\"src\",[26,[\"assets/images/\",[25,\"if\",[[19,1,[\"image\"]],[19,1,[\"image\"]],\"persona.png\"],null]]]],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n        \"],[1,[19,1,[\"name\"]],false],[0,\"\\n    \"],[8],[0,\"\\n\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"    Sorry! No team mebers found.\\n\\n\"]],\"parameters\":[]}],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/components/team-members.hbs" } });
});
define("ijavascript/templates/dashboard", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rXOhRqOV", "block": "{\"symbols\":[\"transaction\"],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[2,\" left section \"],[0,\"\\n    \"],[1,[18,\"nav-panel\"],false],[0,\"\\n\\n    \"],[2,\" right section \"],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"float-right grey-box right-panel\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"float-left mrgn-rgt20\"],[7],[0,\"\\n            \"],[6,\"img\"],[9,\"src\",\"assets/images/user_img.png\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"float-left\"],[7],[0,\"\\n            \"],[6,\"h2\"],[7],[0,\"\\n                Welcome \"],[1,[20,[\"customer\",\"name\"]],false],[0,\"!\\n                \"],[6,\"span\"],[7],[0,\"Last login: \"],[1,[20,[\"customer\",\"last_login\"]],false],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\\n        \"],[6,\"hr\"],[7],[8],[0,\"\\n\\n        \"],[6,\"h3\"],[7],[0,\"Account Balance: \"],[1,[20,[\"customer\",\"balance\"]],false],[8],[0,\"\\n\\n        \"],[6,\"table\"],[7],[0,\"\\n            \"],[6,\"thead\"],[7],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"Date\"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"Amount\"],[8],[0,\"\\n            \"],[8],[0,\"\\n\\n\"],[4,\"each\",[[20,[\"customer\",\"transaction\"]]],null,{\"statements\":[[0,\"                \\n                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"date\"]],false],[8],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"desc\"]],false],[8],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"amount\"]],false],[8],[0,\"\\n                \"],[8],[0,\"\\n\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"                \\n                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"td\"],[9,\"colspan\",\"3\"],[7],[0,\"You have no transaction\"],[8],[0,\"\\n                \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}],[0,\"\\n            \\n        \"],[8],[0,\"\\n\\n        \"],[6,\"hr\"],[7],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"float-left\"],[7],[0,\"\\n            \"],[2,\" modal window example \"],[0,\"\\n            \"],[6,\"h4\"],[7],[0,\"Subscribe to Alerts\"],[8],[0,\"\\n            \"],[6,\"form\"],[7],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"checked\"],[\"checkbox\",[20,[\"isSMS\"]]]]],false],[0,\" SMS Alert \"],[6,\"br\"],[7],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"checked\"],[\"checkbox\",[20,[\"isNewsletter\"]]]]],false],[0,\" Marketting Newsletter\"],[6,\"br\"],[7],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"checked\"],[\"checkbox\",[20,[\"isFlyers\"]]]]],false],[0,\" Flyers\"],[6,\"br\"],[7],[8],[0,\"\\n\\n                \"],[6,\"p\"],[7],[6,\"button\"],[9,\"class\",\"blue_btn\"],[3,\"action\",[[19,0,[]],\"checkSubscription\",[20,[\"isSMS\"]],[20,[\"isNewsletter\"]],[20,[\"isFlyers\"]]]],[7],[0,\"Subscribe\"],[8],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"float-right\"],[7],[0,\"\\n            \"],[2,\" Data binding example \"],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"\\n                \"],[6,\"label\"],[9,\"for\",\"databinding\"],[7],[0,\"Two Way Data Binding\"],[8],[6,\"br\"],[7],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"value\",\"placeholder\"],[[20,[\"databinding\"]],\"Enter Value for two way data binding\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[2,\" data binding text, will appear if text provided in binding textbox \"],[0,\"\\n            \"],[6,\"p\"],[7],[1,[18,\"databinding\"],false],[8],[0,\"\\n\\n            \"],[6,\"p\"],[7],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"value\",\"placeholder\"],[[20,[\"customer\",\"name\"]],\"Modify customer name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/dashboard.hbs" } });
});
define("ijavascript/templates/four-oh-four", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NiPJIvZH", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"container grey-box\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"fouroFour\"],[7],[0,\"\\n        \"],[6,\"img\"],[9,\"src\",\"assets/images/404_ghost.png\"],[9,\"align\",\"left\"],[9,\"class\",\"mrgn-rgt20\"],[7],[8],[0,\"\\n        \"],[6,\"h1\"],[7],[0,\"\\n            404\\n            \"],[6,\"span\"],[7],[0,\"Oops like a ghost!\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"p\"],[7],[0,\"The page you are looking for could not be found. Go to \"],[6,\"u\"],[7],[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"login\"]],\"parameters\":[]},null],[8],[0,\" page.\"],[8],[0,\"\\n        \\n    \"],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/four-oh-four.hbs" } });
});
define("ijavascript/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hqOQmzx9", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[2,\" login form \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"red-box\"],[7],[0,\"\\n   \\n   \"],[2,\"  {{login-form}} \"],[0,\"\\n\\n    \"],[6,\"form\"],[9,\"class\",\"login-form\"],[7],[0,\"\\n        \"],[2,\" top lebel error\"],[0,\"\\n\"],[4,\"if\",[[20,[\"errorMessage\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"top-level-error\"],[7],[0,\"\\n                \"],[1,[18,\"errorMessage\"],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n        \"],[2,\" form \"],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"for\",\"userid\"],[7],[0,\"User Id\"],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"value\",\"placeholder\"],[[20,[\"userid\"]],\"Enter User Id\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n            \"],[6,\"label\"],[9,\"for\",\"password\"],[7],[0,\"Password\"],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[20,[\"password\"]],\"password\",\"Enter Password\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"p\"],[7],[6,\"button\"],[3,\"action\",[[19,0,[]],\"onLoginSubmit\"]],[7],[0,\"Log In\"],[8],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/login.hbs" } });
});
define("ijavascript/templates/team", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9YNmk76j", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[2,\" left section \"],[0,\"\\n    \"],[1,[18,\"nav-panel\"],false],[0,\"\\n\\n\\n    \"],[2,\" right section \"],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"float-right grey-box right-panel\"],[7],[0,\"\\n        \"],[6,\"h2\"],[7],[0,\"Meet the Team\"],[8],[0,\"\\n\\n        \"],[6,\"hr\"],[7],[8],[0,\"\\n        \\n        \"],[6,\"div\"],[9,\"class\",\"float-left\"],[9,\"style\",\"width:70%\"],[7],[0,\"\\n            \"],[1,[18,\"team-members\"],false],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"float-right\"],[7],[0,\"\\n            \"],[6,\"img\"],[9,\"src\",\"assets/images/user_img.png\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"clear\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "ijavascript/templates/team.hbs" } });
});


define('ijavascript/config/environment', [], function() {
  var prefix = 'ijavascript';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("ijavascript/app")["default"].create({"name":"ijavascript","version":"0.0.0+c5e512b1"});
}
//# sourceMappingURL=ijavascript.map
