import { AuthenticationResult , PublicClientApplication , EventType } from '@azure/msal-browser';
import { msalConfig} from '../configs/authConfig'
import { MsalProvider } from '@azure/msal-react';
import { ReactNode } from 'react';

interface AuthProviderProps {
    children:ReactNode
}

export const AuthProvider = ({children} : AuthProviderProps) => {

const msalInstance = new PublicClientApplication(msalConfig);
// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {

    const authenticationResult = event.payload as AuthenticationResult;
    const account = authenticationResult?.account;
    if (event.eventType === EventType.LOGIN_SUCCESS && account) {
          msalInstance.setActiveAccount(account);
    }
});

return <MsalProvider instance={msalInstance}>
                {children}
        </MsalProvider>

}

export function useAuthProvider() {
        return { AuthProvider }
}