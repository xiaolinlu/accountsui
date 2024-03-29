(function() {
    if (!Accounts._loginButtons)
        Accounts._loginButtons = {};


    // for convenience
    var loginButtonsSession = Accounts._loginButtonsSession;

    UI.registerHelper("loginButtons", function () {
        return Template._loginButtons;
    });

    // shared between dropdown and single mode
    Template._loginButtons.events({
        'click #login-buttons-logout': function() {
            Meteor.logout(function() {
                loginButtonsSession.closeDropdown();
            });
        }
    });

    //
    // loginButtonLoggedOut template
    //

    Template._loginButtonsLoggedOut.dropdown = function() {
        return Accounts._loginButtons.dropdown();
    };

    Template._loginButtonsLoggedOut.services = function() {
        return Accounts._loginButtons.getLoginServices();
    };

    Template._loginButtonsLoggedOut.singleService = function() {
        var services = Accounts._loginButtons.getLoginServices();
        if (services.length !== 1)
            throw new Error(
                "Shouldn't be rendering this template with more than one configured service");
        return services[0];
    };

    Template._loginButtonsLoggedOut.configurationLoaded = function() {
        return Accounts.loginServicesConfigured();
    };


    //
    // loginButtonsLoggedIn template
    //

    // decide whether we should show a dropdown rather than a row of
    // buttons
    Template._loginButtonsLoggedIn.dropdown = function() {
        return Accounts._loginButtons.dropdown();
    };

    Template._loginButtonsLoggedIn.displayName = function() {
        return Accounts._loginButtons.displayName();
    };



    //
    // loginButtonsMessage template
    //

    Template._loginButtonsMessages.errorMessage = function() {
        return loginButtonsSession.get('errorMessage');
    };

    Template._loginButtonsMessages.infoMessage = function() {
        return loginButtonsSession.get('infoMessage');
    };

    //
    // loginButtonsLoggingInPadding template
    //

    Template._loginButtonsLoggingInPadding.dropdown = function() {
        return Accounts._loginButtons.dropdown();
    };

    //
    // helpers
    //

    Accounts._loginButtons.displayName = function() {
        var user = Meteor.user();
        if (!user)
            return '';

        if (user.profile && user.profile.name)
            return user.profile.name;
        if (user.username)
            return user.username;
        if (user.emails && user.emails[0] && user.emails[0].address)
            return user.emails[0].address;

        return '';
    };

    Accounts._loginButtons.getLoginServices = function() {
        // First look for OAuth services.
        var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

        // Be equally kind to all login services. This also preserves
        // backwards-compatibility. (But maybe order should be
        // configurable?)
        services.sort();

        // Add password, if it's there; it must come last.
        if (this.hasPasswordService())
            services.push('password');

        return _.map(services, function(name) {
            return {
                name: name
            };
        });
    };

    Accounts._loginButtons.hasPasswordService = function() {
        return !!Package['accounts-password'];
    };

    Accounts._loginButtons.dropdown = function() {
        return this.hasPasswordService() || Accounts._loginButtons.getLoginServices().length > 1;
    };

    // XXX improve these. should this be in accounts-password instead?
    //
    // XXX these will become configurable, and will be validated on
    // the server as well.
    Accounts._loginButtons.validateUsername = function(username) {
        if (username.length >= 3) {
            return true;
        } else {
            loginButtonsSession.errorMessage(i18n('Username_long'));
            return false;
        }
    };
    Accounts._loginButtons.validateEmail = function(email) {
        if (Accounts.ui._passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')
            return true;

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(email)) {
            return true;
        } else {
            loginButtonsSession.errorMessage(i18n('LOGIN.Invalid_email'));
            return false;
        }
    };
    Accounts._loginButtons.validatePassword = function(password) {
        if (password.length >= 6) {
            return true;
        } else {
            loginButtonsSession.errorMessage(i18n('Password_long'));
            return false;
        }
    };

    Accounts._loginButtons.rendered = function () {
        debugger;
    };

})();
