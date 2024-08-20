import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: '8469fefb-53af-4fe3-bcde-0d3ccf42dd1e', 
        authority: 'https://login.microsoftonline.com/541fce2e-9f84-4cf3-8160-b1759287ff68/', 
        redirectUri: '/', 
        postLogoutRedirectUri: '/', 
        navigateToLoginRequestUrl: false, 
    },
    cache: {
        cacheLocation: 'sessionStorage', 
        storeAuthStateInCookie: false, 
    },
    system: {
        loggerOptions: {
            loggerCallback: (level : any, message : any, containsPii : any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: ["User.ReadWrite"],
};


