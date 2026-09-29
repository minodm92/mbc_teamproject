const DEMO_ACCOUNTS_KEY = 'hms-demo-accounts';
const RESERVED_DEMO_ID = 'test';

function normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function accountId(emailOrId) {
    return normalizeEmail(emailOrId).split('@')[0];
}

function readAccounts() {
    try {
        const stored = localStorage.getItem(DEMO_ACCOUNTS_KEY);
        if (!stored) return { accounts: [], error: null };

        const accounts = JSON.parse(stored);
        if (!Array.isArray(accounts)) return { accounts: [], error: '저장된 계정 정보를 읽을 수 없습니다.' };
        return { accounts, error: null };
    } catch {
        return { accounts: [], error: '브라우저에서 계정 정보를 읽을 수 없습니다.' };
    }
}

/** Demo-only credentials for this front-end portfolio. Do not use for production authentication. */
export function registerDemoAccount({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const id = accountId(normalizedEmail);

    if (!normalizedEmail || !password) {
        return { success: false, error: '이메일과 비밀번호를 입력해 주세요.' };
    }
    if (id === RESERVED_DEMO_ID) {
        return { success: false, error: '사용할 수 없는 아이디입니다.' };
    }

    const { accounts, error } = readAccounts();
    if (error) return { success: false, error };
    try {
        localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify([
            ...accounts.filter((account) => normalizeEmail(account.email) !== normalizedEmail),
            { email: normalizedEmail, password },
        ]));
        return { success: true };
    } catch {
        return { success: false, error: '계정 정보를 이 브라우저에 저장하지 못했습니다.' };
    }
}

/** Exposed for the upcoming login flow; accepts the signup email or its ID (email local-part). */
export function findDemoAccount(emailOrId, password) {
    const normalizedValue = normalizeEmail(emailOrId);
    const id = accountId(emailOrId);
    const { accounts, error } = readAccounts();
    if (error) return null;
    return accounts.find((account) => (
        (normalizeEmail(account.email) === normalizedValue || accountId(account.email) === id)
        && account.password === password
    )) ?? null;
}

export function isDemoEmailRegistered(emailOrId) {
    const normalizedEmail = normalizeEmail(emailOrId);
    const { accounts, error } = readAccounts();
    return !error && accounts.some((account) => normalizeEmail(account.email) === normalizedEmail);
}
