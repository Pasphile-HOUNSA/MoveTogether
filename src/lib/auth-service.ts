/**
 * Service d'authentification MoveTogether
 * Gestion passwordless par Magic Link, complétion de profil post-inscription,
 * et assignation du rôle Conducteur lors de la publication d'un trajet.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'movetogether_token';
const USER_KEY = 'movetogether_user';
const DEV_PENDING_KEY = 'movetogether_dev_magic_pending';

export interface DriverReadiness {
    documentComplete: boolean;
    carComplete: boolean;
    missingDocFields: string[];
    missingCarFields: string[];
    documentStatus?: string;
    documentRejectionReason?: string | null;
    isExpired?: boolean;
}

export interface AuthUser {
    iduser?: number;
    email: string;
    firstname?: string;
    lastname?: string;
    name?: string;
    role?: 'passager' | 'conducteur' | 'administrateur' | string;
    phonenumber?: string;
    address?: string;
    sex?: 'Homme' | 'Femme' | 'Autre' | string;
    birthday?: string;
    numpiece?: string;
    scanpiece?: string;
    photoIdentite?: string;
    profileComplete?: boolean;
    missingFields?: string[];
    driverReady?: DriverReadiness;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    error?: string;
    token?: string;
    user?: T;
    data?: T;
    devLink?: string;
}

/**
 * Vérifie localement si le profil utilisateur de la table 'users' est complet.
 * Vérifie prénom, nom, sexe, date de naissance, téléphone, adresse et numéro de pièce.
 */
export function isProfileComplete(user: AuthUser | null): boolean {
    if (!user) return false;
    // Si le serveur a déjà calculé la complétion, on l'utilise directement
    if (typeof user.profileComplete === 'boolean') return user.profileComplete;
    const hasFirstName = Boolean(user.firstname && user.firstname.trim().length > 0);
    const hasLastName = Boolean(user.lastname && user.lastname.trim().length > 0);
    const hasSex = Boolean(user.sex && user.sex.trim().length > 0);
    const hasBirthday = Boolean(user.birthday && user.birthday !== '2000-01-01');
    const hasPhone = Boolean(user.phonenumber && user.phonenumber.trim().length > 0);
    const hasAddress = Boolean(user.address && user.address.trim().length > 0);
    const hasNumpiece = Boolean(user.numpiece && user.numpiece.trim().length > 0);
    return hasFirstName && hasLastName && hasSex && hasBirthday && hasPhone && hasAddress && hasNumpiece;
}

/**
 * Vérifie si l'utilisateur a le rôle conducteur
 */
export function isDriver(user: AuthUser | null): boolean {
    if (!user) return false;
    return user.role === 'conducteur';
}

/**
 * Récupère le profil complet de l'utilisateur connecté depuis le backend.
 * Retourne profileComplete, missingFields, driverReady.
 */
export async function fetchCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const token = getStoredToken();
    if (!token) {
        return { success: false, error: 'Non authentifié' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.user) {
            const user: AuthUser = {
                iduser: data.user.iduser,
                email: data.user.email || '',
                firstname: data.user.firstname || '',
                lastname: data.user.lastname || '',
                name: [data.user.firstname, data.user.lastname].filter(Boolean).join(' ') || data.user.email,
                role: data.user.role || 'passager',
                phonenumber: data.user.phonenumber || '',
                address: data.user.address || '',
                sex: data.user.sex || '',
                birthday: data.user.birthday || '',
                numpiece: data.user.numpiece || '',
                scanpiece: data.user.scanpiece || '',
                photoIdentite: data.user.photoIdentite || data.user.photoId || '',
                profileComplete: data.user.profileComplete,
                missingFields: data.user.missingFields || [],
                driverReady: data.user.driverReady,
            };
            // Met à jour la session locale avec les données fraîches
            saveAuth(token, user);
            return { success: true, user };
        }

        return {
            success: false,
            error: data.error || 'Impossible de récupérer le profil.',
        };
    } catch {
        // Fallback : retourner les données locales
        const localUser = getStoredUser();
        if (localUser) {
            return { success: true, user: localUser };
        }
        return { success: false, error: 'Erreur réseau.' };
    }
}

/**
 * Demande au backend d'attribuer le rôle Conducteur à l'utilisateur connecté.
 * Prérequis : documents + véhicule doivent être complets (vérifiés côté serveur).
 */
export async function becomeDriver(): Promise<ApiResponse<AuthUser>> {
    const token = getStoredToken();
    if (!token) {
        return { success: false, error: 'Non authentifié' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/become-driver`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            // Met à jour le rôle localement après succès
            const localUser = getStoredUser();
            if (localUser) {
                const updated: AuthUser = { ...localUser, role: 'conducteur' };
                saveAuth(token, updated);
            }
            return { success: true, message: data.message, user: data.user };
        }

        return {
            success: false,
            error: data.error || data.message || 'Impossible de devenir conducteur.',
        };
    } catch {
        return { success: false, error: 'Erreur réseau. Vérifiez votre connexion.' };
    }
}

/**
 * Envoi d'un lien magique de connexion ou d'inscription par e-mail
 */
export async function sendMagicLink(
    email: string,
    profileData?: Partial<AuthUser>
): Promise<ApiResponse> {
    const cleanEmail = email.trim().toLowerCase();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/magic-link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: cleanEmail,
                ...(profileData || {}),
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: data.message || 'Un lien d’accès sécurisé a été envoyé à votre adresse e-mail.',
            };
        }

        // Si le serveur backend a retourné une erreur formelle
        return {
            success: false,
            error: data.error || data.message || "Impossible d'envoyer le lien de connexion.",
        };
    } catch {
        // Mode développement / Démo hors-ligne lorsque l'API backend n'est pas encore démarrée
        const devToken = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        const expiresAt = Date.now() + 15 * 60 * 1000;

        if (typeof window !== 'undefined') {
            localStorage.setItem(
                DEV_PENDING_KEY,
                JSON.stringify({
                    email: cleanEmail,
                    token: devToken,
                    expiresAt,
                    ...(profileData || {}),
                })
            );
        }

        const devLink = `/auth/verify?token=${devToken}`;

        return {
            success: true,
            message: "Un lien d'accès a été généré.",
            devLink,
        };
    }
}

/**
 * Validation d'un jeton de lien magique
 */
export async function verifyMagicLink(token: string): Promise<ApiResponse<AuthUser>> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-magic-link?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok && data.token) {
            const user: AuthUser = {
                iduser: data.user?.iduser,
                email: data.user?.email || '',
                firstname: data.user?.firstname || '',
                lastname: data.user?.lastname || '',
                name: [data.user?.firstname, data.user?.lastname].filter(Boolean).join(' ') || data.user?.email,
                role: data.user?.role || 'passager',
                phonenumber: data.user?.phonenumber || '',
                address: data.user?.address || '',
                sex: data.user?.sex || '',
                birthday: data.user?.birthday || '',
                numpiece: data.user?.numpiece || '',
                scanpiece: data.user?.scanpiece || '',
                photoIdentite: data.user?.photoIdentite || data.user?.photoId || '',
                profileComplete: data.user?.profileComplete,
                missingFields: data.user?.missingFields || [],
                driverReady: data.user?.driverReady,
            };

            saveAuth(data.token, user);

            return {
                success: true,
                token: data.token,
                user,
                message: data.message || 'Authentification confirmée.',
            };
        }

        if (data && data.error) {
            return {
                success: false,
                error: data.error,
            };
        }
    } catch {
        // En cas d'indisponibilité du backend, vérifier le jeton de développement local
        if (typeof window !== 'undefined') {
            const pendingRaw = localStorage.getItem(DEV_PENDING_KEY);
            if (pendingRaw) {
                try {
                    const pending = JSON.parse(pendingRaw);
                    if (pending.token === token && pending.expiresAt > Date.now()) {
                        const localUser: AuthUser = {
                            email: pending.email,
                            firstname: pending.firstname || '',
                            lastname: pending.lastname || '',
                            name: [pending.firstname, pending.lastname].filter(Boolean).join(' ') || pending.email,
                            role: pending.role || 'Passager',
                            phonenumber: pending.phonenumber || '',
                            address: pending.address || '',
                            sex: pending.sex || 'Homme',
                            birthday: pending.birthday || '',
                        };
                        const devSessionToken = 'jwt_local_' + Math.random().toString(36).substring(2);
                        saveAuth(devSessionToken, localUser);
                        localStorage.removeItem(DEV_PENDING_KEY);

                        return {
                            success: true,
                            token: devSessionToken,
                            user: localUser,
                            message: 'Connexion locale validée.',
                        };
                    }
                } catch {
                    // Ignorer erreur de parsing JSON
                }
            }
        }
    }

    return {
        success: false,
        error: 'Ce lien de connexion est invalide ou a expiré.',
    };
}

/**
 * Mise à jour du profil utilisateur (post-inscription / onboarding)
 */
export async function updateUserProfile(profileData: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    const currentUser = getStoredUser();
    const token = getStoredToken();

    const updatedUser: AuthUser = {
        ...(currentUser || { email: '' }),
        ...profileData,
        name: [profileData.firstname || currentUser?.firstname, profileData.lastname || currentUser?.lastname]
            .filter(Boolean)
            .join(' ') || currentUser?.email || '',
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                ...profileData,
                iduser: currentUser?.iduser,
                email: currentUser?.email,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const serverUser: AuthUser = {
                ...updatedUser,
                ...data.user,
            };
            saveAuth(token || 'local_session', serverUser);
            return {
                success: true,
                user: serverUser,
                message: 'Profil enregistré avec succès.',
            };
        }
    } catch {
        // En cas d'indisponibilité du backend, persister localement
    }

    // Sauvegarde locale de secours
    saveAuth(token || 'local_session', updatedUser);
    return {
        success: true,
        user: updatedUser,
        message: 'Profil enregistré localement.',
    };
}

export const saveUserProfile = updateUserProfile;

/**
 * Sauvegarde de la session locale
 */
export function saveAuth(token: string, user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Récupération du jeton JWT courant
 */
export function getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Récupération des informations de l'utilisateur connecté
 */
export function getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Déconnexion locale
 */
export function clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Déconnexion avec révocation de session côté backend
 */
export async function logoutUser(): Promise<void> {
    const token = getStoredToken();
    if (token) {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch {}
    }
    clearAuth();
}

/**
 * Vérification de l'état de connexion
 */
export function isAuthenticated(): boolean {
    return Boolean(getStoredToken());
}
