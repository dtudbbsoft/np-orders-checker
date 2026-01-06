from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google.auth.exceptions import GoogleAuthError
from settings import settings

# Google Client ID from settings
GOOGLE_CLIENT_ID = settings.google_client_id

# OAuth2PasswordBearer to extract the Bearer token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    """
    Verify Google ID token and extract user email.
    
    Args:
        token: The Google ID token from the Authorization header
        
    Returns:
        str: The user's email address
        
    Raises:
        HTTPException: If the token is invalid or verification fails
    """
    # print("Verifying token:", token)
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), GOOGLE_CLIENT_ID
        )

        print("Token verified. ID info:", idinfo)
        
        # Ensure the token has the required email claim
        if 'email' not in idinfo:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing email claim",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # The email is in the 'email' claim of the ID token
        email = idinfo['email']
        
        # Optionally verify email is verified by Google
        if not idinfo.get('email_verified', False):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not verified by Google",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return email

    except ValueError as e:
        # Invalid token format or expired
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except GoogleAuthError as e:
        # Google authentication specific errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google auth error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
